package main

import (
        "log"

        "everflown-logistics/database"
        "everflown-logistics/handlers"
        "github.com/gin-contrib/cors"
        "github.com/gin-gonic/gin"
        "github.com/joho/godotenv"
)

func main() {
        // Load environment variables
        if err := godotenv.Load(); err != nil {
                log.Println("No .env file found, using system environment variables")
        }

        // Connect to database
        database.Connect()

        // Set up Gin router
        r := gin.Default()

        // CORS middleware
        config := cors.DefaultConfig()
        config.AllowOrigins = []string{"http://localhost:5000", "https://*.replit.app", "https://*.replit.dev"}
        config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
        config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
        config.AllowCredentials = true
        r.Use(cors.New(config))

        // API routes
        api := r.Group("/api")
        {
                // Auth routes
                api.GET("/user", handlers.GetCurrentUser)
                api.POST("/login", handlers.Login)
                api.POST("/register", handlers.Register)
                api.POST("/logout", handlers.Logout)
                api.GET("/users", handlers.GetUsers)
                api.PUT("/users/:id", handlers.UpdateUser)
                api.DELETE("/users/:id", handlers.DeleteUser)

                // Dashboard routes
                api.GET("/dashboard/stats", handlers.GetDashboardStats)

                // Lead routes
                api.GET("/leads", handlers.GetLeads)
                api.POST("/leads", handlers.CreateLead)
                api.PUT("/leads/:id", handlers.UpdateLead)
                api.DELETE("/leads/:id", handlers.DeleteLead)

                // Customer routes
                api.GET("/customers", handlers.GetCustomers)
                api.POST("/customers", handlers.CreateCustomer)
                api.PUT("/customers/:id", handlers.UpdateCustomer)
                api.DELETE("/customers/:id", handlers.DeleteCustomer)

                // Carrier routes
                api.GET("/carriers", handlers.GetCarriers)
                api.POST("/carriers", handlers.CreateCarrier)
                api.PUT("/carriers/:id", handlers.UpdateCarrier)
                api.DELETE("/carriers/:id", handlers.DeleteCarrier)

                // Order routes
                api.GET("/orders", handlers.GetOrders)
                api.POST("/orders", handlers.CreateOrder)
                api.PUT("/orders/:id", handlers.UpdateOrder)
                api.DELETE("/orders/:id", handlers.DeleteOrder)

                // Dispatch routes
                api.GET("/dispatches", handlers.GetDispatches)
                api.POST("/dispatches", handlers.CreateDispatch)
                api.PUT("/dispatches/:id", handlers.UpdateDispatch)
                api.DELETE("/dispatches/:id", handlers.DeleteDispatch)
                api.GET("/dispatches/:id/rate-confirmation", handlers.GetDispatchRateConfirmation)

                // Quote routes
                api.GET("/quotes", handlers.GetQuotes)
                api.POST("/quotes", handlers.CreateQuote)
                api.PUT("/quotes/:id", handlers.UpdateQuote)
                api.DELETE("/quotes/:id", handlers.DeleteQuote)

                // Invoice routes
                api.GET("/invoices", handlers.GetInvoices)
                api.POST("/invoices", handlers.CreateInvoice)
                api.PUT("/invoices/:id", handlers.UpdateInvoice)
                api.DELETE("/invoices/:id", handlers.DeleteInvoice)

                // Follow-up routes
                api.GET("/followups", handlers.GetFollowUps)
                api.GET("/followups/urgent", handlers.GetUrgentFollowUps)
                api.POST("/followups", handlers.CreateFollowUp)
                api.PUT("/followups/:id", handlers.UpdateFollowUp)
                api.DELETE("/followups/:id", handlers.DeleteFollowUp)

                // PDF generation routes
                api.GET("/invoices/:id/pdf", handlers.GenerateInvoicePDF)
                api.GET("/quotes/:id/pdf", handlers.GenerateQuotePDF)
        }

        // Health check route
        r.GET("/health", func(c *gin.Context) {
                c.JSON(200, gin.H{"status": "ok", "message": "Go backend is running"})
        })

        // Use port 8080 for Go backend (Node.js proxy uses 5000)
        port := "8080"

        log.Printf("Go backend server starting on port %s", port)
        if err := r.Run(":" + port); err != nil {
                log.Fatal("Failed to start server:", err)
        }
}