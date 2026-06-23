package com.example.order.service;

import com.example.order.dto.OrderItemRequest;
import com.example.order.dto.OrderRequest;
import com.example.order.dto.OrderResponse;
import com.example.order.exception.OrderNotFoundException;
import com.example.order.model.Order;
import com.example.order.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("OrderService Tests")
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    private OrderRequest validOrderRequest;
    private Order testOrder;

    @BeforeEach
    void setUp() {
        // Setup valid order request
        OrderItemRequest item1 = new OrderItemRequest();
        item1.setProductId("PROD-001");
        item1.setProductName("Laptop");
        item1.setQuantity(2);
        item1.setUnitPrice(800.00);

        validOrderRequest = new OrderRequest();
        validOrderRequest.setCustomerId("CUST-001");
        validOrderRequest.setCustomerName("John Doe");
        validOrderRequest.setItems(List.of(item1));

        // Setup test order
        testOrder = new Order();
        testOrder.setId(1L);
        testOrder.setCustomerId("CUST-001");
        testOrder.setCustomerName("John Doe");
        testOrder.setTotalAmount(1600.00);
        testOrder.setStatus("PENDING");
        testOrder.setOrderDate(LocalDateTime.now());
    }

    // ==================== CREATE ORDER TESTS ====================

    @Test
    @DisplayName("Should create order with valid request")
    void testCreateOrder_Success() {
        // Arrange
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

        // Act
        OrderResponse response = orderService.createOrder(validOrderRequest);

        // Assert
        assertNotNull(response);
        assertEquals("CUST-001", response.getCustomerId());
        assertEquals("John Doe", response.getCustomerName());
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    @DisplayName("Should throw exception when quantity is 0 or negative")
    void testCreateOrder_InvalidQuantity() {
        // Arrange
        OrderItemRequest invalidItem = new OrderItemRequest();
        invalidItem.setProductId("PROD-001");
        invalidItem.setProductName("Laptop");
        invalidItem.setQuantity(0);
        invalidItem.setUnitPrice(800.00);

        OrderRequest invalidRequest = new OrderRequest();
        invalidRequest.setCustomerId("CUST-001");
        invalidRequest.setCustomerName("John Doe");
        invalidRequest.setItems(List.of(invalidItem));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> orderService.createOrder(invalidRequest));
        assertTrue(exception.getMessage().contains("Quantity must be greater than 0"));
        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw exception when quantity exceeds maximum limit")
    void testCreateOrder_QuantityExceedsLimit() {
        // Arrange
        OrderItemRequest invalidItem = new OrderItemRequest();
        invalidItem.setProductId("PROD-001");
        invalidItem.setProductName("Laptop");
        invalidItem.setQuantity(15000);
        invalidItem.setUnitPrice(800.00);

        OrderRequest invalidRequest = new OrderRequest();
        invalidRequest.setCustomerId("CUST-001");
        invalidRequest.setCustomerName("John Doe");
        invalidRequest.setItems(List.of(invalidItem));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> orderService.createOrder(invalidRequest));
        assertTrue(exception.getMessage().contains("Quantity exceeds maximum limit"));
        verify(orderRepository, never()).save(any());
    }

    // ==================== GET ORDER BY ID TESTS ====================

    @Test
    @DisplayName("Should retrieve order by ID successfully")
    void testGetOrderById_Success() {
        // Arrange
        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));

        // Act
        OrderResponse response = orderService.getOrderById(1L);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("CUST-001", response.getCustomerId());
        verify(orderRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when order not found")
    void testGetOrderById_NotFound() {
        // Arrange
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        OrderNotFoundException exception = assertThrows(OrderNotFoundException.class,
                () -> orderService.getOrderById(999L));
        assertTrue(exception.getMessage().contains("Order not found"));
        verify(orderRepository, times(1)).findById(999L);
    }

    // ==================== GET ALL ORDERS TESTS ====================

    @Test
    @DisplayName("Should retrieve all orders")
    void testGetAllOrders_Success() {
        // Arrange
        List<Order> orders = new ArrayList<>();
        orders.add(testOrder);
        orders.add(testOrder);
        when(orderRepository.findAll()).thenReturn(orders);

        // Act
        List<OrderResponse> responses = orderService.getAllOrders();

        // Assert
        assertNotNull(responses);
        assertEquals(2, responses.size());
        verify(orderRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should return empty list when no orders exist")
    void testGetAllOrders_Empty() {
        // Arrange
        when(orderRepository.findAll()).thenReturn(new ArrayList<>());

        // Act
        List<OrderResponse> responses = orderService.getAllOrders();

        // Assert
        assertNotNull(responses);
        assertTrue(responses.isEmpty());
        verify(orderRepository, times(1)).findAll();
    }

    // ==================== GET ORDERS BY CUSTOMER TESTS ====================

    @Test
    @DisplayName("Should retrieve orders by customer ID")
    void testGetOrdersByCustomer_Success() {
        // Arrange
        List<Order> orders = new ArrayList<>();
        orders.add(testOrder);
        when(orderRepository.findByCustomerId("CUST-001")).thenReturn(orders);

        // Act
        List<OrderResponse> responses = orderService.getOrdersByCustomer("CUST-001");

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("CUST-001", responses.get(0).getCustomerId());
        verify(orderRepository, times(1)).findByCustomerId("CUST-001");
    }

    @Test
    @DisplayName("Should return empty list for customer with no orders")
    void testGetOrdersByCustomer_Empty() {
        // Arrange
        when(orderRepository.findByCustomerId("CUST-999")).thenReturn(new ArrayList<>());

        // Act
        List<OrderResponse> responses = orderService.getOrdersByCustomer("CUST-999");

        // Assert
        assertNotNull(responses);
        assertTrue(responses.isEmpty());
    }

    // ==================== GET ORDERS BY DATE RANGE TESTS ====================

    @Test
    @DisplayName("Should retrieve orders within date range")
    void testGetOrdersByDateRange_Success() {
        // Arrange
        LocalDateTime start = LocalDateTime.now().minusDays(7);
        LocalDateTime end = LocalDateTime.now();
        List<Order> orders = new ArrayList<>();
        orders.add(testOrder);
        when(orderRepository.findByOrderDateBetween(start, end)).thenReturn(orders);

        // Act
        List<OrderResponse> responses = orderService.getOrdersByDateRange(start, end);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        verify(orderRepository, times(1)).findByOrderDateBetween(start, end);
    }

    @Test
    @DisplayName("Should return empty list for date range with no orders")
    void testGetOrdersByDateRange_Empty() {
        // Arrange
        LocalDateTime start = LocalDateTime.now().minusDays(30);
        LocalDateTime end = LocalDateTime.now().minusDays(20);
        when(orderRepository.findByOrderDateBetween(start, end)).thenReturn(new ArrayList<>());

        // Act
        List<OrderResponse> responses = orderService.getOrdersByDateRange(start, end);

        // Assert
        assertNotNull(responses);
        assertTrue(responses.isEmpty());
    }

    // ==================== DELETE ORDER TESTS ====================

    @Test
    @DisplayName("Should delete order successfully")
    void testDeleteOrder_Success() {
        // Arrange
        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));

        // Act
        orderService.deleteOrder(1L);

        // Assert
        verify(orderRepository, times(1)).findById(1L);
        verify(orderRepository, times(1)).delete(testOrder);
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent order")
    void testDeleteOrder_NotFound() {
        // Arrange
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        OrderNotFoundException exception = assertThrows(OrderNotFoundException.class,
                () -> orderService.deleteOrder(999L));
        assertTrue(exception.getMessage().contains("Order not found"));
        verify(orderRepository, never()).delete(any());
    }
}
