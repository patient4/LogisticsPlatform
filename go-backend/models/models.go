package models

import (
        "time"
)

// User represents a user in the system
type User struct {
        ID              string    `json:"id" gorm:"primaryKey;type:varchar(255)"`
        Username        string    `json:"username" gorm:"uniqueIndex;not null;type:varchar(255)"`
        Password        string    `json:"password" gorm:"not null;type:varchar(255)"`
        Email           string    `json:"email" gorm:"uniqueIndex;type:varchar(255)"`
        FirstName       *string   `json:"firstName" gorm:"type:varchar(255)"`
        LastName        *string   `json:"lastName" gorm:"type:varchar(255)"`
        ProfileImageURL *string   `json:"profileImageUrl" gorm:"type:varchar(500)"`
        Role            string    `json:"role" gorm:"type:varchar(50)"`
        CreatedAt       time.Time `json:"createdAt"`
        UpdatedAt       time.Time `json:"updatedAt"`
}

// Lead represents a potential customer
type Lead struct {
        ID               uint      `json:"id" gorm:"primaryKey"`
        CompanyName      string    `json:"companyName" gorm:"not null"`
        ContactPerson    string    `json:"contactPerson" gorm:"not null"`
        Email            string    `json:"email" gorm:"not null"`
        Phone            string    `json:"phone" gorm:"not null"`
        OriginCity       *string   `json:"originCity"`
        OriginState      *string   `json:"originState"`
        DestinationCity  *string   `json:"destinationCity"`
        DestinationState *string   `json:"destinationState"`
        PickupDate       *string   `json:"pickupDate"`
        EquipmentType    *string   `json:"equipmentType"`
        Commodity        *string   `json:"commodity"`
        Weight           *int      `json:"weight"`
        Notes            *string   `json:"notes"`
        Status           string    `json:"status" gorm:"default:new"`
        CreatedAt        time.Time `json:"createdAt"`
        UpdatedAt        time.Time `json:"updatedAt"`
}

// Customer represents a customer
type Customer struct {
        ID                  uint      `json:"id" gorm:"primaryKey"`
        CompanyName         string    `json:"companyName" gorm:"not null"`
        ContactPerson       string    `json:"contactPerson" gorm:"not null"`
        Email               string    `json:"email" gorm:"not null"`
        Phone               string    `json:"phone" gorm:"not null"`
        Address             *string   `json:"address"`
        City                *string   `json:"city"`
        State               *string   `json:"state"`
        ZipCode             *string   `json:"zipCode"`
        BillingAddress      *string   `json:"billingAddress"`
        BillingCity         *string   `json:"billingCity"`
        BillingState        *string   `json:"billingState"`
        BillingZipCode      *string   `json:"billingZipCode"`
        CreditLimit         *float64  `json:"creditLimit"`
        PaymentTerms        string    `json:"paymentTerms" gorm:"default:Net 30"`
        SpecialInstructions *string   `json:"specialInstructions"`
        IsActive            bool      `json:"isActive" gorm:"default:true"`
        CreatedAt           time.Time `json:"createdAt"`
        UpdatedAt           time.Time `json:"updatedAt"`
}

// Carrier represents a carrier
type Carrier struct {
        ID                uint      `json:"id" gorm:"primaryKey"`
        CompanyName       string    `json:"companyName" gorm:"not null"`
        ContactPerson     string    `json:"contactPerson" gorm:"not null"`
        Email             string    `json:"email" gorm:"not null"`
        Phone             string    `json:"phone" gorm:"not null"`
        Address           *string   `json:"address"`
        City              *string   `json:"city"`
        State             *string   `json:"state"`
        ZipCode           *string   `json:"zipCode"`
        MCNumber          *string   `json:"mcNumber"`
        DOTNumber         *string   `json:"dotNumber"`
        InsuranceExpiry   *string   `json:"insuranceExpiry"`
        W9OnFile          bool      `json:"w9OnFile" gorm:"default:false"`
        PerformanceRating float64   `json:"performanceRating" gorm:"default:0.00"`
        PreferredLanes    *string   `json:"preferredLanes"`
        EquipmentTypes    *string   `json:"equipmentTypes"`
        Notes             *string   `json:"notes"`
        IsActive          bool      `json:"isActive" gorm:"default:true"`
        CreatedAt         time.Time `json:"createdAt"`
        UpdatedAt         time.Time `json:"updatedAt"`
}

// Order represents an order
type Order struct {
        ID                   uint      `json:"id" gorm:"primaryKey"`
        OrderNumber          string    `json:"orderNumber" gorm:"not null;uniqueIndex"`
        CustomerID           *uint     `json:"customerId"`
        Customer             *Customer `json:"customer,omitempty" gorm:"foreignKey:CustomerID"`
        CustomerName         *string   `json:"customerName"`
        LeadID               *uint     `json:"leadId"`
        Lead                 *Lead     `json:"lead,omitempty" gorm:"foreignKey:LeadID"`
        OriginCompany        *string   `json:"originCompany"`
        OriginAddress        string    `json:"originAddress" gorm:"not null"`
        OriginCity           string    `json:"originCity" gorm:"not null"`
        OriginState          string    `json:"originState" gorm:"not null"`
        OriginZipCode        string    `json:"originZipCode" gorm:"not null"`
        DestinationCompany   *string   `json:"destinationCompany"`
        DestinationAddress   string    `json:"destinationAddress" gorm:"not null"`
        DestinationCity      string    `json:"destinationCity" gorm:"not null"`
        DestinationState     string    `json:"destinationState" gorm:"not null"`
        DestinationZipCode   string    `json:"destinationZipCode" gorm:"not null"`
        PickupDate           string    `json:"pickupDate" gorm:"not null"`
        DeliveryDate         *string   `json:"deliveryDate"`
        EquipmentType        string    `json:"equipmentType" gorm:"not null"`
        Weight               *float64  `json:"weight"`
        Commodity            *string   `json:"commodity"`
        CustomerRate         float64   `json:"customerRate" gorm:"not null"`
        Status               string    `json:"status" gorm:"default:needs_truck"`
        SpecialInstructions  *string   `json:"specialInstructions"`
        CreatedAt            time.Time `json:"createdAt"`
        UpdatedAt            time.Time `json:"updatedAt"`
}

// Dispatch represents a dispatch
type Dispatch struct {
        ID                     uint      `json:"id" gorm:"primaryKey"`
        OrderID                uint      `json:"orderId"`
        Order                  *Order    `json:"order,omitempty" gorm:"foreignKey:OrderID"`
        CarrierID              uint      `json:"carrierId"`
        Carrier                *Carrier  `json:"carrier,omitempty" gorm:"foreignKey:CarrierID"`
        CarrierRate            float64   `json:"carrierRate" gorm:"not null"`
        DriverName             *string   `json:"driverName"`
        DriverPhone            *string   `json:"driverPhone"`
        TruckNumber            *string   `json:"truckNumber"`
        TrailerNumber          *string   `json:"trailerNumber"`
        Status                 string    `json:"status" gorm:"default:assigned"`
        RateConfirmationSent   bool      `json:"rateConfirmationSent" gorm:"default:false"`
        RateConfirmationSigned bool      `json:"rateConfirmationSigned" gorm:"default:false"`
        EstimatedPickupTime    *string   `json:"estimatedPickupTime"`
        ActualPickupTime       *string   `json:"actualPickupTime"`
        EstimatedDeliveryTime  *string   `json:"estimatedDeliveryTime"`
        ActualDeliveryTime     *string   `json:"actualDeliveryTime"`
        Notes                  *string   `json:"notes"`
        CreatedAt              time.Time `json:"createdAt"`
        UpdatedAt              time.Time `json:"updatedAt"`
}

// Quote represents a quote
type Quote struct {
        ID               uint      `json:"id" gorm:"primaryKey"`
        QuoteNumber      string    `json:"quoteNumber" gorm:"not null;uniqueIndex"`
        LeadID           *uint     `json:"leadId"`
        Lead             *Lead     `json:"lead,omitempty" gorm:"foreignKey:LeadID"`
        CustomerID       *uint     `json:"customerId"`
        Customer         *Customer `json:"customer,omitempty" gorm:"foreignKey:CustomerID"`
        OriginCity       string    `json:"originCity" gorm:"not null"`
        OriginState      string    `json:"originState" gorm:"not null"`
        DestinationCity  string    `json:"destinationCity" gorm:"not null"`
        DestinationState string    `json:"destinationState" gorm:"not null"`
        PickupDate       *string   `json:"pickupDate"`
        EquipmentType    string    `json:"equipmentType" gorm:"not null"`
        Weight           *float64  `json:"weight"`
        Commodity        *string   `json:"commodity"`
        QuotedRate       float64   `json:"quotedRate" gorm:"not null"`
        ValidUntil       string    `json:"validUntil" gorm:"not null"`
        Status           string    `json:"status" gorm:"default:pending"`
        Notes            *string   `json:"notes"`
        CreatedAt        time.Time `json:"createdAt"`
        UpdatedAt        time.Time `json:"updatedAt"`
}

// Invoice represents an invoice
type Invoice struct {
        ID            uint      `json:"id" gorm:"primaryKey"`
        InvoiceNumber string    `json:"invoiceNumber" gorm:"not null;uniqueIndex"`
        Type          string    `json:"type" gorm:"not null"`
        CustomerID    *uint     `json:"customerId"`
        Customer      *Customer `json:"customer,omitempty" gorm:"foreignKey:CustomerID"`
        CarrierID     *uint     `json:"carrierId"`
        Carrier       *Carrier  `json:"carrier,omitempty" gorm:"foreignKey:CarrierID"`
        OrderID       *uint     `json:"orderId"`
        Order         *Order    `json:"order,omitempty" gorm:"foreignKey:OrderID"`
        DispatchID    *uint     `json:"dispatchId"`
        Dispatch      *Dispatch `json:"dispatch,omitempty" gorm:"foreignKey:DispatchID"`
        Amount        float64   `json:"amount" gorm:"not null"`
        Status        string    `json:"status" gorm:"default:draft"`
        DueDate       string    `json:"dueDate" gorm:"not null"`
        PaidDate      *string   `json:"paidDate"`
        Notes         *string   `json:"notes"`
        CreatedAt     time.Time `json:"createdAt"`
        UpdatedAt     time.Time `json:"updatedAt"`
}

// FollowUp represents a follow-up task
type FollowUp struct {
        ID          uint      `json:"id" gorm:"primaryKey"`
        Title       string    `json:"title" gorm:"not null"`
        Description *string   `json:"description"`
        Type        string    `json:"type" gorm:"not null"`
        LeadID      *uint     `json:"leadId"`
        Lead        *Lead     `json:"lead,omitempty" gorm:"foreignKey:LeadID"`
        CustomerID  *uint     `json:"customerId"`
        Customer    *Customer `json:"customer,omitempty" gorm:"foreignKey:CustomerID"`
        CarrierID   *uint     `json:"carrierId"`
        Carrier     *Carrier  `json:"carrier,omitempty" gorm:"foreignKey:CarrierID"`
        OrderID     *uint     `json:"orderId"`
        Order       *Order    `json:"order,omitempty" gorm:"foreignKey:OrderID"`
        DueDate     time.Time `json:"dueDate" gorm:"not null"`
        Completed   bool      `json:"completed" gorm:"default:false"`
        CompletedAt *string   `json:"completedAt"`
        Priority    string    `json:"priority" gorm:"default:medium"`
        AssignedTo  *string   `json:"assignedTo"`
        Notes       *string   `json:"notes"`
        CreatedAt   time.Time `json:"createdAt"`
        UpdatedAt   time.Time `json:"updatedAt"`
}

// DashboardStats represents dashboard statistics
type DashboardStats struct {
        ActiveOrders    int     `json:"activeOrders"`
        InTransit       int     `json:"inTransit"`
        PendingInvoices int     `json:"pendingInvoices"`
        Revenue         float64 `json:"revenue"`
        TotalLeads      int     `json:"totalLeads"`
        TotalCustomers  int     `json:"totalCustomers"`
        TotalCarriers   int     `json:"totalCarriers"`
        TotalOrders     int     `json:"totalOrders"`
}