# 📝 Datos Personalizados a Rellenar

## 🔐 Información Que Necesitas Obtener

Antes de usar los archivos, necesitas recopilar esta información:

### 1️⃣ **AWS Account**
```
AWS_ACCOUNT_ID = 123456789012  (Obtener de: AWS Console → Account)
AWS_REGION = us-east-1         (Tu región preferida)
```

### 2️⃣ **GitHub Repository**
```
GITHUB_OWNER = Smlprz
GITHUB_REPO = SmartLogix_CASO_A_2026
GITHUB_BRANCH = features/devops
```

### 3️⃣ **Bases de Datos**
```
DB_HOST = postgres              (localhost en desarrollo)
DB_PORT = 5432
DB_USER = smartlogix
DB_PASSWORD = TU_CONTRASEÑA_SEGURA
DB_NAME = smartlogix_db
```

---

## 📋 Archivos a Modificar

### 1. `.env` (Copia de .env.example)
```bash
# Copiar y llenar
cp .env.example .env

# Modificar con tus valores:
DB_USER=smartlogix
DB_PASSWORD=TU_PASSWORD_SEGURA
AWS_ACCOUNT_ID=123456789012
AWS_REGION=us-east-1
ECR_REGISTRY=123456789012.dkr.ecr.us-east-1.amazonaws.com
```

### 2. `.github/workflows/build-and-push.yml`
**Busca y reemplaza:**

```yaml
# Línea ~12-14: Región y registry
env:
  AWS_REGION: us-east-1                    # ← Cambiar si usas otra región
  REGISTRY: ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.${{ env.AWS_REGION }}.amazonaws.com
```

**Ya está configurado para usar GitHub Secrets (correcto ✓)**

### 3. `.github/workflows/deploy-to-aws.yml`
**Busca y reemplaza:**

```yaml
# Línea ~9-13
env:
  AWS_REGION: us-east-1                    # ← Cambiar si es necesario
  ECS_CLUSTER: smartlogix-cluster          # ← Tu nombre de cluster
  ECS_SERVICE_PREFIX: smartlogix-service   # ← Prefijo de servicios
```

### 4. `docker-compose.yml`
**Busca y reemplaza:**

```yaml
# Línea ~12-16: Database
postgres:
  environment:
    POSTGRES_USER: ${DB_USER:-smartlogix}           # ← Cambiar si quieres
    POSTGRES_PASSWORD: ${DB_PASSWORD:-smartlogix123} # ← CAMBIAR PASSWORD
    POSTGRES_DB: ${DB_NAME:-smartlogix_db}
```

### 5. `task-definitions/frontend-task-def.json`
**Busca y reemplaza estos placeholders:**

```json
// Línea ~6: Image URI
"image": "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/smartlogix-frontend:latest",
//         ↑ REEMPLAZAR: 123456789012.dkr.ecr.us-east-1.amazonaws.com/...

// Línea ~31: Región CloudWatch
"awslogs-region": "us-east-1",  // ← REEMPLAZAR si usas otra región

// Línea ~39-41: API URL
"name": "VITE_API_URL",
"value": "http://smartlogix-usuario.service.local:8080"  // ← Mantener así

// Línea ~56-57: Roles IAM
"executionRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskExecutionRole",
//                                    ↑ REEMPLAZAR: 123456789012

"taskRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskRole",
//                              ↑ REEMPLAZAR: 123456789012
```

### 6. `task-definitions/backend-task-def-template.json`
**Busca y reemplaza:**

```json
// Línea ~6: Image (templated)
"image": "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/smartlogix-SERVICE_NAME:latest",
//         ↑ REEMPLAZAR: 123456789012.dkr.ecr.us-east-1.amazonaws.com/...

// Línea ~37: Región
"awslogs-region": "us-east-1",  // ← REEMPLAZAR si es necesario

// Línea ~52-54: Eureka URL
"name": "EUREKA_CLIENT_SERVICEURL_DEFAULTZONE",
"value": "http://smartlogix-eureka.service.local:8761/eureka/"  // ← Mantener así

// Línea ~58-62: Secrets Manager (actualizar si cambias secretos)
"name": "SPRING_DATASOURCE_USERNAME",
"valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:smartlogix/db-user"
//                                                ↑ REEMPLAZAR: 123456789012

// Línea ~65-68
"name": "SPRING_DATASOURCE_URL",
"valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:smartlogix/db-url"
//                                                ↑ REEMPLAZAR: 123456789012

// Línea ~83-84: Roles IAM
"executionRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskExecutionRole",
"taskRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskRole",
//                          ↑ REEMPLAZAR: 123456789012 (2 lugares)
```

### 7. `push-to-ecr.sh`
**No necesita cambios - usa parámetros en línea de comandos:**

```bash
./push-to-ecr.sh 123456789012 us-east-1
                 ↑ Tu AWS Account ID
                             ↑ Tu región
```

### 8. `build-all.sh`
**No necesita cambios - usa parámetro opcional:**

```bash
./build-all.sh smartlogix
               ↑ Nombre del registry (opcional)
```

### 9. `DEVOPS_SETUP.md`
**Busca estos placeholders:**

```markdown
# Línea ~XX: AWS CLI config
aws configure
# Ingresar: AWS Account ID, Access Key, Secret Key

# Línea ~XX: Push a ECR
./push-to-ecr.sh <TU_AWS_ACCOUNT_ID>
                 ↑ REEMPLAZAR: 123456789012

# Línea ~XX: GitHub Secrets
AWS_ACCOUNT_ID = 123456789012      # ← Tu Account ID
AWS_REGION = us-east-1             # ← Tu región
AWS_ROLE_ARN = arn:aws:iam::123456789012:role/...  # ← Tu rol
```

---

## 🔧 **GitHub Secrets a Crear**

Ve a: **GitHub → Settings → Secrets and variables → Actions**

Agrega estos secrets:

```
Name: AWS_ACCOUNT_ID
Value: 123456789012

Name: AWS_REGION
Value: us-east-1

Name: AWS_ROLE_ARN
Value: arn:aws:iam::123456789012:role/smartlogix-github-role
```

---

## 📊 **Checklist de Datos Necesarios**

Obtén primero estos datos de AWS:

- [ ] **AWS Account ID** (12 dígitos)
  ```bash
  aws sts get-caller-identity --query Account
  ```

- [ ] **AWS Region** (ej: us-east-1, us-west-2)
  ```bash
  aws ec2 describe-regions --query 'Regions[0].RegionName'
  ```

- [ ] **IAM Role ARN** (para GitHub Actions)
  ```bash
  aws iam get-role --role-name smartlogix-github-role --query 'Role.Arn'
  ```

- [ ] **RDS Endpoint** (después de crear)
  ```bash
  aws rds describe-db-instances --query 'DBInstances[0].Endpoint.Address'
  ```

- [ ] **Database Credentials** (username y password que creaste)

---

## 📝 **Script para Rellenar Automáticamente**

Si quieres, crea este script `setup-config.sh`:

```bash
#!/bin/bash

echo "=== SmartLogix Configuration Setup ==="
read -p "AWS Account ID: " AWS_ACCOUNT_ID
read -p "AWS Region [us-east-1]: " AWS_REGION
AWS_REGION=${AWS_REGION:-us-east-1}

read -p "Database Password: " DB_PASSWORD
read -p "Database User [smartlogix]: " DB_USER
DB_USER=${DB_USER:-smartlogix}

# Crear .env
cat > .env << EOF
AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID
AWS_REGION=$AWS_REGION
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
ECR_REGISTRY=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
EOF

echo "✓ Archivo .env creado"
echo "Recuerda agregar AWS_ROLE_ARN a GitHub Secrets"
```

---

## ✅ **Validación Final**

Antes de usar los archivos, verifica:

```bash
# 1. .env existe y tiene valores
cat .env

# 2. AWS CLI está configurado
aws sts get-caller-identity

# 3. Docker está corriendo
docker --version

# 4. Git está en la rama correcta
git branch

# 5. GitHub Secrets están configurados
# (Ve a GitHub → Settings → Secrets)
```

---

## 🚀 **Orden de Rellenado Recomendado**

1. **Primero:** Obtener `AWS_ACCOUNT_ID` y `AWS_REGION`
2. **Segundo:** Crear `.env` con valores
3. **Tercero:** Rellenar task definitions JSON
4. **Cuarto:** Crear GitHub Secrets
5. **Quinto:** Modificar DEVOPS_SETUP.md si es necesario

---

## 📞 **Datos de Ejemplo (Para Entender)**

```
AWS_ACCOUNT_ID: 123456789012
AWS_REGION: us-east-1
ECR_REGISTRY: 123456789012.dkr.ecr.us-east-1.amazonaws.com

DB_HOST: postgres (local) / rds-instance.123456.us-east-1.rds.amazonaws.com (AWS)
DB_PORT: 5432
DB_USER: smartlogix
DB_PASSWORD: MiPassword@Segura123

GitHub Repo: https://github.com/Smlprz/SmartLogix_CASO_A_2026
GitHub Branch: features/devops

ECS Cluster: smartlogix-cluster
ECS Services: smartlogix-service-frontend, smartlogix-service-usuario, etc
```

---

**Una vez tengas estos datos, todos los archivos estarán listos para usar. 🎯**
