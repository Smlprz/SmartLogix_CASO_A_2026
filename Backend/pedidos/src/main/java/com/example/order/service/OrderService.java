package com.example.order.service;

import com.example.order.dto.*;
import com.example.order.model.*;
import com.example.order.repository.OrderRepository;
import com.example.order.exception.OrderNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        validateInventory(request.getItems());

        Order order = new Order();
        order.setCustomerId(request.getCustomerId());
        order.setCustomerName(request.getCustomerName());

        List<OrderItem> items = request.getItems().stream()
                .map(item -> {
                    String productId = (item.getProductId() != null && !item.getProductId().isBlank())
                            ? item.getProductId()
                            : "PROD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                    OrderItem orderItem = new OrderItem(
                            productId,
                            item.getProductName(),
                            item.getQuantity(),
                            item.getUnitPrice()
                    );
                    orderItem.setOrder(order);
                    return orderItem;
                })
                .collect(Collectors.toList());

        order.setItems(items);

        double total = items.stream()
                .mapToDouble(OrderItem::getSubtotal)
                .sum();
        order.setTotalAmount(total);

        Order savedOrder = orderRepository.save(order);
        return convertToResponse(savedOrder);
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + id));
        return convertToResponse(order);
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByCustomer(String customerId) {
        return orderRepository.findByCustomerId(customerId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByDateRange(LocalDateTime start, LocalDateTime end) {
        return orderRepository.findByOrderDateBetween(start, end).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + id));
        orderRepository.delete(order);
    }

    private void validateInventory(List<OrderItemRequest> items) {
        for (OrderItemRequest item : items) {
            if (item.getQuantity() <= 0) {
                throw new RuntimeException("Quantity must be greater than 0 for product: " + item.getProductId());
            }
            if (item.getQuantity() > 10000) {
                throw new RuntimeException("Quantity exceeds maximum limit for product: " + item.getProductId());
            }
        }
    }

    private OrderResponse convertToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setCustomerId(order.getCustomerId());
        response.setCustomerName(order.getCustomerName());
        response.setOrderDate(order.getOrderDate());
        response.setTotalAmount(order.getTotalAmount());

        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(this::convertToItemResponse)
                .collect(Collectors.toList());
        response.setItems(itemResponses);
        response.setStatus(order.getStatus() != null ? order.getStatus() : "PENDING");

        return response;
    }

    private OrderItemResponse convertToItemResponse(OrderItem item) {
        OrderItemResponse response = new OrderItemResponse();
        response.setId(item.getId());
        response.setProductId(item.getProductId());
        response.setProductName(item.getProductName());
        response.setQuantity(item.getQuantity());
        response.setUnitPrice(item.getUnitPrice());
        response.setSubtotal(item.getSubtotal());
        return response;
    }
}
