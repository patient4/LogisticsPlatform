package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"everflown-logistics/database"
	"everflown-logistics/handlers"
	"everflown-logistics/models"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// MockDB is a mock database for testing
type MockDB struct {
	mock.Mock
}

func setupTestDB() (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Auto-migrate the schema
	err = db.AutoMigrate(
		&models.User{},
		&models.Lead{},
		&models.Customer{},
		&models.Carrier{},
		&models.Order{},
		&models.Dispatch{},
		&models.Quote{},
		&models.Invoice{},
		&models.FollowUp{},
	)
	if err != nil {
		return nil, err
	}

	return db, nil
}

func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	
	api := router.Group("/api")
	{
		// Test routes
		api.GET("/leads", handlers.GetLeads)
		api.POST("/leads", handlers.CreateLead)
		api.PUT("/leads/:id", handlers.UpdateLead)
		api.DELETE("/leads/:id", handlers.DeleteLead)
		
		api.GET("/customers", handlers.GetCustomers)
		api.POST("/customers", handlers.CreateCustomer)
		
		api.GET("/quotes", handlers.GetQuotes)
		api.POST("/quotes", handlers.CreateQuote)
		api.PUT("/quotes/:id", handlers.UpdateQuote)
		api.DELETE("/quotes/:id", handlers.DeleteQuote)
		api.GET("/quotes/:id/pdf", handlers.GenerateQuotePDF)
		
		api.GET("/invoices/:id/pdf", handlers.GenerateInvoicePDF)
		
		api.GET("/dashboard/stats", handlers.GetDashboardStats)
	}
	
	return router
}

func TestGetLeads(t *testing.T) {
	// Setup test database
	testDB, err := setupTestDB()
	assert.NoError(t, err)
	database.DB = testDB

	// Create test data
	lead := models.Lead{
		CompanyName:      "Test Company",
		ContactPerson:    "John Doe",
		Email:            "john@test.com",
		Phone:            "(555) 123-4567",
		OriginCity:       "Los Angeles",
		OriginState:      "CA",
		DestinationCity:  "Chicago",
		DestinationState: "IL",
		PickupDate:       time.Now(),
		EquipmentType:    "Dry Van",
		Status:           "new",
	}
	testDB.Create(&lead)

	// Setup router
	router := setupTestRouter()

	// Create request
	req, _ := http.NewRequest("GET", "/api/leads", nil)
	w := httptest.NewRecorder()

	// Perform request
	router.ServeHTTP(w, req)

	// Assert response
	assert.Equal(t, http.StatusOK, w.Code)
	
	var response []models.Lead
	err = json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Len(t, response, 1)
	assert.Equal(t, "Test Company", response[0].CompanyName)
}

func TestCreateLead(t *testing.T) {
	// Setup test database
	testDB, err := setupTestDB()
	assert.NoError(t, err)
	database.DB = testDB

	// Setup router
	router := setupTestRouter()

	// Create test lead data
	leadData := models.Lead{
		CompanyName:      "New Test Company",
		ContactPerson:    "Jane Smith",
		Email:            "jane@newtest.com",
		Phone:            "(555) 987-6543",
		OriginCity:       "Houston",
		OriginState:      "TX",
		DestinationCity:  "Denver",
		DestinationState: "CO",
		PickupDate:       time.Now().AddDate(0, 0, 7),
		EquipmentType:    "Refrigerated",
		Status:           "new",
		Notes:            "Temperature sensitive",
	}

	jsonData, _ := json.Marshal(leadData)
	req, _ := http.NewRequest("POST", "/api/leads", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	// Perform request
	router.ServeHTTP(w, req)

	// Assert response
	assert.Equal(t, http.StatusCreated, w.Code)
	
	var response models.Lead
	err = json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "New Test Company", response.CompanyName)
	assert.Equal(t, "jane@newtest.com", response.Email)
}

func TestUpdateLead(t *testing.T) {
	// Setup test database
	testDB, err := setupTestDB()
	assert.NoError(t, err)
	database.DB = testDB

	// Create initial lead
	lead := models.Lead{
		CompanyName:      "Original Company",
		ContactPerson:    "Original Contact",
		Email:            "original@test.com",
		Status:           "new",
	}
	testDB.Create(&lead)

	// Setup router
	router := setupTestRouter()

	// Update data
	updateData := map[string]interface{}{
		"companyName":   "Updated Company",
		"contactPerson": "Updated Contact",
		"status":        "contacted",
	}

	jsonData, _ := json.Marshal(updateData)
	req, _ := http.NewRequest("PUT", "/api/leads/1", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	// Perform request
	router.ServeHTTP(w, req)

	// Assert response
	assert.Equal(t, http.StatusOK, w.Code)
	
	// Verify update in database
	var updatedLead models.Lead
	testDB.First(&updatedLead, 1)
	assert.Equal(t, "Updated Company", updatedLead.CompanyName)
	assert.Equal(t, "contacted", updatedLead.Status)
}

func TestDeleteLead(t *testing.T) {
	// Setup test database
	testDB, err := setupTestDB()
	assert.NoError(t, err)
	database.DB = testDB

	// Create lead to delete
	lead := models.Lead{
		CompanyName: "To Be Deleted",
		Email:       "delete@test.com",
		Status:      "new",
	}
	testDB.Create(&lead)

	// Setup router
	router := setupTestRouter()

	// Delete request
	req, _ := http.NewRequest("DELETE", "/api/leads/1", nil)
	w := httptest.NewRecorder()

	// Perform request
	router.ServeHTTP(w, req)

	// Assert response
	assert.Equal(t, http.StatusOK, w.Code)
	
	// Verify deletion
	var deletedLead models.Lead
	result := testDB.First(&deletedLead, 1)
	assert.Error(t, result.Error) // Should return error since record is deleted
}

func TestCreateCustomer(t *testing.T) {
	// Setup test database
	testDB, err := setupTestDB()
	assert.NoError(t, err)
	database.DB = testDB

	// Setup router
	router := setupTestRouter()

	// Create test customer data
	customerData := models.Customer{
		CompanyName:         "Test Customer Inc",
		ContactPerson:       "Customer Contact",
		Email:               "customer@test.com",
		Phone:               "(555) 111-2222",
		Address:             "123 Customer St",
		City:                "Customer City",
		State:               "CA",
		ZipCode:             "90210",
		BillingAddress:      "123 Billing St",
		BillingCity:         "Billing City",
		BillingState:        "CA",
		BillingZipCode:      "90211",
		CreditLimit:         50000.00,
		PaymentTerms:        "Net 30",
		SpecialInstructions: "Test instructions",
		IsActive:            true,
	}

	jsonData, _ := json.Marshal(customerData)
	req, _ := http.NewRequest("POST", "/api/customers", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	// Perform request
	router.ServeHTTP(w, req)

	// Assert response
	assert.Equal(t, http.StatusCreated, w.Code)
	
	var response models.Customer
	err = json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "Test Customer Inc", response.CompanyName)
	assert.Equal(t, 50000.00, response.CreditLimit)
}

func TestCreateQuote(t *testing.T) {
	// Setup test database
	testDB, err := setupTestDB()
	assert.NoError(t, err)
	database.DB = testDB

	// Create required lead and customer
	lead := models.Lead{
		CompanyName: "Quote Lead Company",
		Email:       "lead@quote.com",
		Status:      "new",
	}
	testDB.Create(&lead)

	customer := models.Customer{
		CompanyName:  "Quote Customer",
		Email:        "customer@quote.com",
		PaymentTerms: "Net 30",
		IsActive:     true,
	}
	testDB.Create(&customer)

	// Setup router
	router := setupTestRouter()

	// Create quote data
	quoteData := models.Quote{
		QuoteNumber:      "QTE-TEST-001",
		LeadID:           lead.ID,
		CustomerID:       customer.ID,
		OriginCity:       "Los Angeles",
		OriginState:      "CA",
		DestinationCity:  "Chicago",
		DestinationState: "IL",
		EquipmentType:    "Dry Van",
		Weight:           25000,
		Commodity:        "Electronics",
		QuotedRate:       2500.00,
		ValidUntil:       time.Now().AddDate(0, 0, 30),
		Status:           "pending",
		Notes:            "Test quote",
	}

	jsonData, _ := json.Marshal(quoteData)
	req, _ := http.NewRequest("POST", "/api/quotes", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	// Perform request
	router.ServeHTTP(w, req)

	// Assert response
	assert.Equal(t, http.StatusCreated, w.Code)
	
	var response models.Quote
	err = json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "QTE-TEST-001", response.QuoteNumber)
	assert.Equal(t, 2500.00, response.QuotedRate)
}

func TestDashboardStats(t *testing.T) {
	// Setup test database
	testDB, err := setupTestDB()
	assert.NoError(t, err)
	database.DB = testDB

	// Create test data for dashboard stats
	customer := models.Customer{
		CompanyName:  "Stats Customer",
		PaymentTerms: "Net 30",
		IsActive:     true,
	}
	testDB.Create(&customer)

	lead := models.Lead{
		CompanyName: "Stats Lead",
		Status:      "new",
	}
	testDB.Create(&lead)

	order := models.Order{
		OrderNumber:         "ORD-STATS-001",
		CustomerID:          customer.ID,
		LeadID:              lead.ID,
		OriginCity:          "Test Origin",
		OriginState:         "CA",
		OriginAddress:       "123 Origin St",
		OriginZipCode:       "90210",
		DestinationCity:     "Test Destination",
		DestinationState:    "NY",
		DestinationAddress:  "456 Dest St",
		DestinationZipCode:  "10001",
		PickupDate:          time.Now(),
		EquipmentType:       "Dry Van",
		CustomerRate:        2500.00,
		Status:              "in_transit",
	}
	testDB.Create(&order)

	quote := models.Quote{
		QuoteNumber:     "QTE-STATS-001",
		LeadID:          lead.ID,
		CustomerID:      customer.ID,
		OriginCity:      "Test Origin",
		OriginState:     "CA",
		DestinationCity: "Test Destination",
		DestinationState: "NY",
		EquipmentType:   "Dry Van",
		QuotedRate:      2500.00,
		ValidUntil:      time.Now().AddDate(0, 0, 30),
		Status:          "pending",
	}
	testDB.Create(&quote)

	// Setup router
	router := setupTestRouter()

	// Create request
	req, _ := http.NewRequest("GET", "/api/dashboard/stats", nil)
	w := httptest.NewRecorder()

	// Perform request
	router.ServeHTTP(w, req)

	// Assert response
	assert.Equal(t, http.StatusOK, w.Code)
	
	var response map[string]interface{}
	err = json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Contains(t, response, "activeOrders")
	assert.Contains(t, response, "inTransit")
	assert.Contains(t, response, "pendingQuotes")
}

func TestInvalidIDHandling(t *testing.T) {
	// Setup test database
	testDB, err := setupTestDB()
	assert.NoError(t, err)
	database.DB = testDB

	// Setup router
	router := setupTestRouter()

	// Test invalid ID format
	req, _ := http.NewRequest("PUT", "/api/leads/invalid", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	
	var response map[string]string
	err = json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "Invalid ID", response["error"])
}

func TestNotFoundHandling(t *testing.T) {
	// Setup test database
	testDB, err := setupTestDB()
	assert.NoError(t, err)
	database.DB = testDB

	// Setup router
	router := setupTestRouter()

	// Test non-existent resource
	req, _ := http.NewRequest("PUT", "/api/leads/999", bytes.NewBuffer([]byte(`{"companyName": "Test"}`)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}