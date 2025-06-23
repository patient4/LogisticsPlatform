package handlers

import (
	"net/http"
	"strconv"
	"time"

	"everflown-logistics/database"
	"everflown-logistics/models"
	"github.com/gin-gonic/gin"
)

// Helper function to create string pointers
func stringPtr(s string) *string {
	return &s
}

// Simple hash for demo - in production use bcrypt
func hashPassword(password string) (string, error) {
	return password + "_hashed", nil
}

// Simple verify for demo - in production use bcrypt
func verifyPassword(password, hashedPassword string) bool {
	return password+"_hashed" == hashedPassword
}

// Auth handlers
func GetCurrentUser(c *gin.Context) {
	// Create default admin user for authentication
	hashedPassword, _ := hashPassword("admin")

	user := models.User{
		ID:        "admin-1750604677654",
		Username:  "admin",
		Password:  hashedPassword,
		Email:     "admin@everflown.com",
		FirstName: stringPtr("System"),
		LastName:  stringPtr("Administrator"),
		Role:      "admin",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	c.JSON(http.StatusOK, user)
}

func Login(c *gin.Context) {
	var loginData struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// For admin login
	if loginData.Username == "admin" && loginData.Password == "admin" {
		hashedPassword, _ := hashPassword("admin")
		user := models.User{
			ID:        "admin-1750604677654",
			Username:  "admin",
			Password:  hashedPassword,
			Email:     "admin@everflown.com",
			FirstName: stringPtr("System"),
			LastName:  stringPtr("Administrator"),
			Role:      "admin",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
		c.JSON(http.StatusOK, user)
		return
	}

	var user models.User
	if err := database.DB.Where("username = ?", loginData.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	if !verifyPassword(loginData.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func Register(c *gin.Context) {
	var userData struct {
		Username  string  `json:"username" binding:"required"`
		Password  string  `json:"password" binding:"required"`
		Email     string  `json:"email" binding:"required"`
		FirstName *string `json:"firstName"`
		LastName  *string `json:"lastName"`
		Role      string  `json:"role"`
	}

	if err := c.ShouldBindJSON(&userData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user already exists
	var existingUser models.User
	if err := database.DB.Where("username = ?", userData.Username).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
		return
	}

	hashedPassword, err := hashPassword(userData.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	if userData.Role == "" {
		userData.Role = "user"
	}

	user := models.User{
		ID:        "user-" + strconv.FormatInt(time.Now().UnixNano()/1000, 10),
		Username:  userData.Username,
		Password:  hashedPassword,
		Email:     userData.Email,
		FirstName: userData.FirstName,
		LastName:  userData.LastName,
		Role:      userData.Role,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, user)
}

func Logout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

func GetUsers(c *gin.Context) {
	var users []models.User
	if err := database.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}
	c.JSON(http.StatusOK, users)
}

func UpdateUser(c *gin.Context) {
	id := c.Param("id")
	var userData models.User

	if err := c.ShouldBindJSON(&userData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userData.UpdatedAt = time.Now()

	if err := database.DB.Model(&models.User{}).Where("id = ?", id).Updates(&userData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	var updatedUser models.User
	database.DB.Where("id = ?", id).First(&updatedUser)
	c.JSON(http.StatusOK, updatedUser)
}

func DeleteUser(c *gin.Context) {
	id := c.Param("id")

	if err := database.DB.Delete(&models.User{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

// Dashboard handlers
func GetDashboardStats(c *gin.Context) {
	var activeOrders, inTransit, pendingQuotes, totalRevenue int64
	var avgDeliveryTime float64

	database.DB.Model(&models.Order{}).Where("status IN ?", []string{"dispatched", "in_transit", "needs_truck"}).Count(&activeOrders)
	database.DB.Model(&models.Order{}).Where("status = ?", "in_transit").Count(&inTransit)
	database.DB.Model(&models.Quote{}).Where("status = ?", "pending").Count(&pendingQuotes)
	database.DB.Model(&models.Invoice{}).Where("type = ? AND status = ?", "customer", "paid").Select("COALESCE(SUM(CAST(amount AS DECIMAL)), 0)").Scan(&totalRevenue)

	// Calculate average delivery time (mock calculation)
	avgDeliveryTime = 3.2

	stats := gin.H{
		"activeOrders":    activeOrders,
		"inTransit":       inTransit,
		"pendingQuotes":   pendingQuotes,
		"totalRevenue":    totalRevenue,
		"avgDeliveryTime": avgDeliveryTime,
	}

	c.JSON(http.StatusOK, stats)
}

// Lead handlers
func GetLeads(c *gin.Context) {
	var leads []models.Lead
	if err := database.DB.Find(&leads).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch leads"})
		return
	}
	c.JSON(http.StatusOK, leads)
}

func CreateLead(c *gin.Context) {
	var lead models.Lead
	if err := c.ShouldBindJSON(&lead); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	lead.CreatedAt = time.Now()
	lead.UpdatedAt = time.Now()

	if err := database.DB.Create(&lead).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create lead"})
		return
	}

	c.JSON(http.StatusCreated, lead)
}

func UpdateLead(c *gin.Context) {
	id := c.Param("id")
	var leadData models.Lead

	if err := c.ShouldBindJSON(&leadData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	leadData.UpdatedAt = time.Now()

	if err := database.DB.Model(&models.Lead{}).Where("id = ?", id).Updates(&leadData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update lead"})
		return
	}

	var updatedLead models.Lead
	database.DB.Where("id = ?", id).First(&updatedLead)
	c.JSON(http.StatusOK, updatedLead)
}

func DeleteLead(c *gin.Context) {
	id := c.Param("id")

	if err := database.DB.Delete(&models.Lead{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete lead"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Lead deleted successfully"})
}

// Basic stub handlers for other entities
func GetCustomers(c *gin.Context) {
	var customers []models.Customer
	database.DB.Find(&customers)
	c.JSON(http.StatusOK, customers)
}

func CreateCustomer(c *gin.Context) {
	var customer models.Customer
	if err := c.ShouldBindJSON(&customer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&customer)
	c.JSON(http.StatusCreated, customer)
}

func UpdateCustomer(c *gin.Context) {
	id := c.Param("id")
	var customer models.Customer
	c.ShouldBindJSON(&customer)
	database.DB.Model(&customer).Where("id = ?", id).Updates(&customer)
	c.JSON(http.StatusOK, customer)
}

func DeleteCustomer(c *gin.Context) {
	id := c.Param("id")
	database.DB.Delete(&models.Customer{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Customer deleted"})
}

func GetCarriers(c *gin.Context) {
	var carriers []models.Carrier
	database.DB.Find(&carriers)
	c.JSON(http.StatusOK, carriers)
}

func CreateCarrier(c *gin.Context) {
	var carrier models.Carrier
	c.ShouldBindJSON(&carrier)
	database.DB.Create(&carrier)
	c.JSON(http.StatusCreated, carrier)
}

func UpdateCarrier(c *gin.Context) {
	id := c.Param("id")
	var carrier models.Carrier
	c.ShouldBindJSON(&carrier)
	database.DB.Model(&carrier).Where("id = ?", id).Updates(&carrier)
	c.JSON(http.StatusOK, carrier)
}

func DeleteCarrier(c *gin.Context) {
	id := c.Param("id")
	database.DB.Delete(&models.Carrier{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Carrier deleted"})
}

func GetOrders(c *gin.Context) {
	var orders []models.Order
	database.DB.Find(&orders)
	c.JSON(http.StatusOK, orders)
}

func CreateOrder(c *gin.Context) {
	var order models.Order
	c.ShouldBindJSON(&order)
	database.DB.Create(&order)
	c.JSON(http.StatusCreated, order)
}

func UpdateOrder(c *gin.Context) {
	id := c.Param("id")
	var order models.Order
	c.ShouldBindJSON(&order)
	database.DB.Model(&order).Where("id = ?", id).Updates(&order)
	c.JSON(http.StatusOK, order)
}

func DeleteOrder(c *gin.Context) {
	id := c.Param("id")
	database.DB.Delete(&models.Order{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Order deleted"})
}

func GetDispatches(c *gin.Context) {
	var dispatches []models.Dispatch
	database.DB.Find(&dispatches)
	c.JSON(http.StatusOK, dispatches)
}

func CreateDispatch(c *gin.Context) {
	var dispatch models.Dispatch
	c.ShouldBindJSON(&dispatch)
	database.DB.Create(&dispatch)
	c.JSON(http.StatusCreated, dispatch)
}

func UpdateDispatch(c *gin.Context) {
	id := c.Param("id")
	var dispatch models.Dispatch
	c.ShouldBindJSON(&dispatch)
	database.DB.Model(&dispatch).Where("id = ?", id).Updates(&dispatch)
	c.JSON(http.StatusOK, dispatch)
}

func DeleteDispatch(c *gin.Context) {
	id := c.Param("id")
	database.DB.Delete(&models.Dispatch{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Dispatch deleted"})
}

func GetQuotes(c *gin.Context) {
	var quotes []models.Quote
	database.DB.Find(&quotes)
	c.JSON(http.StatusOK, quotes)
}

func CreateQuote(c *gin.Context) {
	var quote models.Quote
	c.ShouldBindJSON(&quote)
	database.DB.Create(&quote)
	c.JSON(http.StatusCreated, quote)
}

func UpdateQuote(c *gin.Context) {
	id := c.Param("id")
	var quote models.Quote
	c.ShouldBindJSON(&quote)
	database.DB.Model(&quote).Where("id = ?", id).Updates(&quote)
	c.JSON(http.StatusOK, quote)
}

func DeleteQuote(c *gin.Context) {
	id := c.Param("id")
	database.DB.Delete(&models.Quote{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Quote deleted"})
}

func GetInvoices(c *gin.Context) {
	var invoices []models.Invoice
	database.DB.Find(&invoices)
	c.JSON(http.StatusOK, invoices)
}

func CreateInvoice(c *gin.Context) {
	var invoice models.Invoice
	c.ShouldBindJSON(&invoice)
	database.DB.Create(&invoice)
	c.JSON(http.StatusCreated, invoice)
}

func UpdateInvoice(c *gin.Context) {
	id := c.Param("id")
	var invoice models.Invoice
	c.ShouldBindJSON(&invoice)
	database.DB.Model(&invoice).Where("id = ?", id).Updates(&invoice)
	c.JSON(http.StatusOK, invoice)
}

func DeleteInvoice(c *gin.Context) {
	id := c.Param("id")
	database.DB.Delete(&models.Invoice{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Invoice deleted"})
}

func GetFollowUps(c *gin.Context) {
	var followUps []models.FollowUp
	database.DB.Find(&followUps)
	c.JSON(http.StatusOK, followUps)
}

func GetUrgentFollowUps(c *gin.Context) {
	var followUps []models.FollowUp
	database.DB.Where("priority = ? AND completed = ?", "high", false).Find(&followUps)
	c.JSON(http.StatusOK, followUps)
}

func CreateFollowUp(c *gin.Context) {
	var followUp models.FollowUp
	c.ShouldBindJSON(&followUp)
	database.DB.Create(&followUp)
	c.JSON(http.StatusCreated, followUp)
}

func UpdateFollowUp(c *gin.Context) {
	id := c.Param("id")
	var followUp models.FollowUp
	c.ShouldBindJSON(&followUp)
	database.DB.Model(&followUp).Where("id = ?", id).Updates(&followUp)
	c.JSON(http.StatusOK, followUp)
}

func DeleteFollowUp(c *gin.Context) {
	id := c.Param("id")
	database.DB.Delete(&models.FollowUp{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "FollowUp deleted"})
}

// Placeholder PDF handlers
func GenerateQuotePDF(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "PDF generation not implemented yet"})
}

func GenerateInvoicePDF(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "PDF generation not implemented yet"})
}

func GetDispatchRateConfirmation(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Rate confirmation not implemented yet"})
}