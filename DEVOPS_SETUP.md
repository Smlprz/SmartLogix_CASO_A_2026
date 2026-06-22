# DevOps Setup Guide - SmartLogix

## 📋 Archivos Creados

### Dockerfiles
- `Backend/Dockerfile.eureka` - Eureka Server
- `Backend/Dockerfile.backend` - Backend microservicios genérico
- `Frontend/Dockerfile` - Frontend React + Nginx
- `Frontend/nginx.conf` - Configuración Nginx

### Orquestación
- `docker-compose.yml` - Desarrollo local (todos los servicios)

### CI/CD Workflows
- `.github/workflows/build-and-push.yml` - Build y push a ECR
- `.github/workflows/deploy-to-aws.yml` - Deploy a ECS

### Scripts
- `build-all.sh` - Build local de todas las imágenes
- `push-to-ecr.sh` - Push a AWS ECR

### Configuración ECS
- `task-definitions/frontend-task-def.json` - Frontend task definition
- `task-definitions/backend-task-def-template.json` - Template para backend

### Variables
- `.env.example` - Plantilla de variables de entorno

---

## 🚀 Paso a Paso de Uso

### FASE 1: Desarrollo Local (Sin AWS)

#### 1. Clonar y preparar
```bash
git clone <repo>
cd SmartLogix_CASO_A_2026
git checkout features/devops
cp .env.example .env
```

#### 2. Buildear imágenes localmente
```bash
chmod +x build-all.sh
./build-all.sh smartlogix
```

Esto crea todas las imágenes Docker locales:
- `smartlogix-frontend:latest`
- `smartlogix-usuario:latest`
- `smartlogix-pedidos:latest`
- `smartlogix-envios:latest`
- `smartlogix-inventory:latest`
- `smartlogix-eureka:latest`

#### 3. Testear con docker-compose
```bash
docker-compose up -d
```

**Verificar servicios:**
- Frontend: http://localhost
- Eureka: http://localhost:8761
- Usuario: http://localhost:8081
- Pedidos: http://localhost:8082
- Envios: http://localhost:8083
- Inventory: http://localhost:8084

```bash
# Ver logs
docker-compose logs -f

# Parar todos
docker-compose down
```

---

### FASE 2: Configuración en AWS

#### 1. Crear cuenta AWS Academy
- Acceder a AWS Academy
- Activar "Learner Lab"
- Obtener credenciales temporales
- Configurar AWS CLI:
```bash
aws configure
# Ingresa credentials de Academy
```

#### 2. Crear ECR Repositories
```bash
chmod +x push-to-ecr.sh
./push-to-ecr.sh <TU_AWS_ACCOUNT_ID>
```

Este script automáticamente:
- Loguea en ECR
- Crea 6 repositorios
- Pushea todas las imágenes

#### 3. Configurar GitHub Secrets
Ve a: `Settings → Secrets and variables → Actions`

Agrega:
```
AWS_ACCOUNT_ID = 123456789012
AWS_REGION = us-east-1
AWS_ROLE_ARN = arn:aws:iam::ACCOUNT:role/smartlogix-github-role
```

#### 4. Crear clúster ECS
```bash
# Via AWS Console o CLI:
aws ecs create-cluster --cluster-name smartlogix-cluster

# Crear VPC, subredes, ALB, Security Groups
# (Manual via AWS Console)
```

#### 5. Crear RDS PostgreSQL
```bash
# Via AWS Console:
# - Engine: PostgreSQL 15
# - Instance: db.t3.micro
# - Almacenamiento: 20 GB
# - Credentials: guardadas en Secrets Manager
```

#### 6. Crear task definitions
```bash
# En AWS Console:
# - Importar task-definitions/frontend-task-def.json
# - Importar task-definitions/backend-task-def-template.json
# - Reemplazar ACCOUNT_ID con tu AWS Account
```

#### 7. Crear servicios ECS
Para cada task definition:
```bash
aws ecs create-service \
  --cluster smartlogix-cluster \
  --service-name smartlogix-service-frontend \
  --task-definition smartlogix-frontend:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=smartlogix-frontend,containerPort=80"
```

---

### FASE 3: CI/CD Automático

#### 1. Hacer commit en GitHub
```bash
git add .
git commit -m "feat: add Docker and DevOps configuration"
git push origin features/devops
```

#### 2. GitHub Actions automáticamente:
1. **build-and-push.yml** se ejecuta:
   - Build Backend (Maven)
   - Build Frontend (npm)
   - Build imágenes Docker
   - Push a ECR

2. **deploy-to-aws.yml** se ejecuta:
   - Actualiza task definitions
   - Despliega en ECS
   - Monitorea estabilidad

#### 3. Validar en AWS
```bash
# Ver servicios corriendo
aws ecs list-services --cluster smartlogix-cluster

# Ver tareas
aws ecs list-tasks --cluster smartlogix-cluster

# Ver logs
aws logs tail /ecs/smartlogix-frontend --follow
```

---

## 🔄 Workflow de Desarrollo

### Local Development
```bash
# 1. Haz cambios en código
nano Backend/usuario/src/...
nano Frontend/src/...

# 2. Testea localmente
docker-compose down
./build-all.sh smartlogix
docker-compose up -d

# 3. Verifica http://localhost

# 4. Commit
git add .
git commit -m "fix: bug en usuario service"
git push origin features/devops
```

### Deployment a AWS
```
Push a GitHub → GitHub Actions:
  ├─ build-and-push.yml
  │  ├─ Maven build
  │  ├─ npm build
  │  ├─ Docker build
  │  └─ Push a ECR ✓
  │
  └─ deploy-to-aws.yml
     ├─ Update ECS task definitions
     ├─ Deploy a ECS
     ├─ Monitor status
     └─ Success ✓
```

---

## 🔧 Configuración Manual (AWS)

### 1. IAM Roles requeridos

**ecsTaskExecutionRole:**
```json
{
  "Effect": "Allow",
  "Action": [
    "ecr:GetAuthorizationToken",
    "ecr:BatchGetImage",
    "ecr:GetDownloadUrlForLayer",
    "logs:CreateLogGroup",
    "logs:CreateLogStream",
    "logs:PutLogEvents",
    "secretsmanager:GetSecretValue"
  ],
  "Resource": "*"
}
```

**ecsTaskRole:**
```json
{
  "Effect": "Allow",
  "Action": [
    "logs:CreateLogGroup",
    "logs:CreateLogStream",
    "logs:PutLogEvents",
    "cloudwatch:PutMetricData",
    "xray:PutTraceSegments"
  ],
  "Resource": "*"
}
```

### 2. Security Groups
- ALB: 80, 443 from 0.0.0.0/0
- ECS Tasks: 8080 from ALB
- RDS: 5432 from ECS Tasks

### 3. Monitoring
```bash
# CloudWatch Logs
aws logs describe-log-groups --log-group-name-prefix /ecs

# Metrics
aws cloudwatch list-metrics --namespace AWS/ECS
```

---

## 📊 Validación Funcional

### Tests básicos
```bash
# Frontend accesible
curl -I http://<ALB_URL>

# Backend respondiendo
curl http://<ALB_URL>/api/users

# Eureka registrando servicios
curl http://<EUREKA_URL>:8761/eureka/apps

# Logs en CloudWatch
aws logs tail /ecs/smartlogix-frontend --follow
```

### Autoscaling
```bash
# Crear target tracking
aws applicationautoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/smartlogix-cluster/smartlogix-service-usuario \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 1 \
  --max-capacity 4

aws applicationautoscaling put-scaling-policy \
  --policy-name cpu-tracking \
  --service-namespace ecs \
  --resource-id service/smartlogix-cluster/smartlogix-service-usuario \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration "TargetValue=50.0,PredefinedMetricSpecification={PredefinedMetricType=ECSServiceAverageCPUUtilization}"
```

---

## 🐛 Troubleshooting

### Imágenes no buildeando
```bash
# Verificar Dockerfile
docker build -f Backend/Dockerfile.backend -t test .

# Ver error completo
docker build --no-cache -f Backend/Dockerfile.backend -t test .
```

### ECR login failing
```bash
# Re-login
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin $AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com
```

### ECS task no Starting
```bash
# Ver logs
aws logs tail /ecs/smartlogix-usuario --follow

# Ver eventos del servicio
aws ecs describe-services \
  --cluster smartlogix-cluster \
  --services smartlogix-service-usuario \
  --query 'services[0].events' --output table
```

### RDS Connection Error
```bash
# Verificar security group
aws ec2 describe-security-groups --group-ids sg-xxx

# Test conexión
psql -h <RDS_ENDPOINT> -U smartlogix -d smartlogix_db
```

---

## 📚 Recursos Útiles

- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Spring Boot on Docker](https://spring.io/guides/gs/spring-boot-docker/)

---

**Nota:** Este es un setup básico. Para producción, considera:
- Multi-region deployment
- Auto-scaling policies más sofisticadas
- Disaster recovery
- Cost optimization
- Blue-green deployments
