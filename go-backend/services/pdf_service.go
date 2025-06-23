package services

import (
	"bytes"
	"fmt"
	"strconv"
	"time"

	"everflown-logistics/models"
	"github.com/jung-kurt/gofpdf"
)

type PDFService struct{}

func NewPDFService() *PDFService {
	return &PDFService{}
}

func (s *PDFService) GenerateInvoicePDF(invoice models.Invoice, order models.Order, customer models.Customer) ([]byte, error) {
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()

	// EverFlown Logistics Header
	pdf.SetFont("Arial", "B", 24)
	pdf.SetTextColor(41, 128, 185) // Blue color
	pdf.Cell(0, 15, "EverFlown Logistics")
	pdf.Ln(10)

	// Subtitle
	pdf.SetFont("Arial", "", 12)
	pdf.SetTextColor(128, 128, 128)
	pdf.Cell(0, 8, "Professional Freight Brokerage Services")
	pdf.Ln(15)

	// Invoice Title
	pdf.SetFont("Arial", "B", 20)
	pdf.SetTextColor(0, 0, 0)
	pdf.Cell(0, 12, "INVOICE")
	pdf.Ln(15)

	// Invoice Details Box
	pdf.SetFillColor(245, 245, 245)
	pdf.Rect(10, pdf.GetY(), 190, 25, "F")
	
	// Invoice Info
	pdf.SetFont("Arial", "B", 10)
	pdf.Cell(40, 6, "Invoice Number:")
	pdf.SetFont("Arial", "", 10)
	pdf.Cell(60, 6, invoice.InvoiceNumber)
	
	pdf.SetFont("Arial", "B", 10)
	pdf.Cell(30, 6, "Invoice Date:")
	pdf.SetFont("Arial", "", 10)
	pdf.Cell(60, 6, invoice.CreatedAt.Format("January 2, 2006"))
	pdf.Ln(6)

	pdf.SetFont("Arial", "B", 10)
	pdf.Cell(40, 6, "Due Date:")
	pdf.SetFont("Arial", "", 10)
	pdf.Cell(60, 6, invoice.DueDate.Format("January 2, 2006"))
	
	pdf.SetFont("Arial", "B", 10)
	pdf.Cell(30, 6, "Order Number:")
	pdf.SetFont("Arial", "", 10)
	pdf.Cell(60, 6, order.OrderNumber)
	pdf.Ln(15)

	// Bill To Section
	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(0, 8, "Bill To:")
	pdf.Ln(8)
	
	pdf.SetFont("Arial", "", 10)
	pdf.Cell(0, 6, customer.CompanyName)
	pdf.Ln(6)
	if customer.ContactPerson != "" {
		pdf.Cell(0, 6, "Attn: "+customer.ContactPerson)
		pdf.Ln(6)
	}
	pdf.Cell(0, 6, customer.BillingAddress)
	pdf.Ln(6)
	pdf.Cell(0, 6, fmt.Sprintf("%s, %s %s", customer.BillingCity, customer.BillingState, customer.BillingZipCode))
	pdf.Ln(15)

	// Shipment Details
	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(0, 8, "Shipment Details:")
	pdf.Ln(8)

	// Table Header
	pdf.SetFillColor(41, 128, 185)
	pdf.SetTextColor(255, 255, 255)
	pdf.SetFont("Arial", "B", 9)
	
	colWidths := []float64{60, 50, 50, 30}
	headers := []string{"Origin - Destination", "Equipment Type", "Commodity", "Amount"}
	
	for i, header := range headers {
		pdf.CellFormat(colWidths[i], 8, header, "1", 0, "C", true, 0, "")
	}
	pdf.Ln(8)

	// Table Row
	pdf.SetFillColor(255, 255, 255)
	pdf.SetTextColor(0, 0, 0)
	pdf.SetFont("Arial", "", 9)
	
	route := fmt.Sprintf("%s, %s - %s, %s", order.OriginCity, order.OriginState, order.DestinationCity, order.DestinationState)
	commodity := order.Commodity
	if commodity == "" {
		commodity = "General Freight"
	}
	amount := fmt.Sprintf("$%.2f", invoice.Amount)
	
	values := []string{route, order.EquipmentType, commodity, amount}
	
	for i, value := range values {
		alignment := "L"
		if i == 3 { // Amount column - right align
			alignment = "R"
		}
		pdf.CellFormat(colWidths[i], 8, value, "1", 0, alignment, true, 0, "")
	}
	pdf.Ln(15)

	// Total Section
	pdf.SetFont("Arial", "B", 12)
	totalY := pdf.GetY()
	pdf.SetXY(140, totalY)
	pdf.Cell(30, 8, "Total Amount:")
	pdf.Cell(20, 8, fmt.Sprintf("$%.2f", invoice.Amount))
	pdf.Ln(15)

	// Payment Terms
	pdf.SetFont("Arial", "B", 10)
	pdf.Cell(0, 8, "Payment Terms:")
	pdf.Ln(6)
	pdf.SetFont("Arial", "", 10)
	pdf.Cell(0, 6, customer.PaymentTerms)
	pdf.Ln(10)

	// Notes
	if invoice.Notes != "" {
		pdf.SetFont("Arial", "B", 10)
		pdf.Cell(0, 8, "Notes:")
		pdf.Ln(6)
		pdf.SetFont("Arial", "", 10)
		pdf.MultiCell(0, 6, invoice.Notes, "", "", false)
		pdf.Ln(5)
	}

	// Footer
	pdf.Ln(10)
	pdf.SetFont("Arial", "I", 8)
	pdf.SetTextColor(128, 128, 128)
	pdf.Cell(0, 6, "Thank you for your business! For questions about this invoice, please contact us.")
	pdf.Ln(4)
	pdf.Cell(0, 6, "EverFlown Logistics - Your Trusted Freight Partner")

	var buf bytes.Buffer
	err := pdf.Output(&buf)
	if err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

func (s *PDFService) GenerateQuotePDF(quote models.Quote, lead models.Lead) ([]byte, error) {
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()

	// EverFlown Logistics Header
	pdf.SetFont("Arial", "B", 24)
	pdf.SetTextColor(41, 128, 185) // Blue color
	pdf.Cell(0, 15, "EverFlown Logistics")
	pdf.Ln(10)

	// Subtitle
	pdf.SetFont("Arial", "", 12)
	pdf.SetTextColor(128, 128, 128)
	pdf.Cell(0, 8, "Professional Freight Brokerage Services")
	pdf.Ln(15)

	// Quote Title
	pdf.SetFont("Arial", "B", 20)
	pdf.SetTextColor(0, 0, 0)
	pdf.Cell(0, 12, "FREIGHT QUOTE")
	pdf.Ln(15)

	// Quote Details Box
	pdf.SetFillColor(245, 245, 245)
	pdf.Rect(10, pdf.GetY(), 190, 25, "F")
	
	// Quote Info
	pdf.SetFont("Arial", "B", 10)
	pdf.Cell(40, 6, "Quote Number:")
	pdf.SetFont("Arial", "", 10)
	pdf.Cell(60, 6, quote.QuoteNumber)
	
	pdf.SetFont("Arial", "B", 10)
	pdf.Cell(30, 6, "Quote Date:")
	pdf.SetFont("Arial", "", 10)
	pdf.Cell(60, 6, quote.CreatedAt.Format("January 2, 2006"))
	pdf.Ln(6)

	pdf.SetFont("Arial", "B", 10)
	pdf.Cell(40, 6, "Valid Until:")
	pdf.SetFont("Arial", "", 10)
	pdf.Cell(60, 6, quote.ValidUntil.Format("January 2, 2006"))
	
	pdf.SetFont("Arial", "B", 10)
	pdf.Cell(30, 6, "Status:")
	pdf.SetFont("Arial", "", 10)
	pdf.Cell(60, 6, quote.Status)
	pdf.Ln(15)

	// Quote For Section
	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(0, 8, "Quote For:")
	pdf.Ln(8)
	
	pdf.SetFont("Arial", "", 10)
	pdf.Cell(0, 6, lead.CompanyName)
	pdf.Ln(6)
	if lead.ContactPerson != "" {
		pdf.Cell(0, 6, "Attn: "+lead.ContactPerson)
		pdf.Ln(6)
	}
	if lead.Email != "" {
		pdf.Cell(0, 6, "Email: "+lead.Email)
		pdf.Ln(6)
	}
	if lead.Phone != "" {
		pdf.Cell(0, 6, "Phone: "+lead.Phone)
		pdf.Ln(6)
	}
	pdf.Ln(10)

	// Shipment Details
	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(0, 8, "Shipment Details:")
	pdf.Ln(8)

	// Table Header
	pdf.SetFillColor(41, 128, 185)
	pdf.SetTextColor(255, 255, 255)
	pdf.SetFont("Arial", "B", 9)
	
	colWidths := []float64{50, 40, 30, 30, 40}
	headers := []string{"Origin - Destination", "Equipment", "Weight (lbs)", "Commodity", "Quoted Rate"}
	
	for i, header := range headers {
		pdf.CellFormat(colWidths[i], 8, header, "1", 0, "C", true, 0, "")
	}
	pdf.Ln(8)

	// Table Row
	pdf.SetFillColor(255, 255, 255)
	pdf.SetTextColor(0, 0, 0)
	pdf.SetFont("Arial", "", 9)
	
	route := fmt.Sprintf("%s, %s - %s, %s", quote.OriginCity, quote.OriginState, quote.DestinationCity, quote.DestinationState)
	commodity := quote.Commodity
	if commodity == "" {
		commodity = "General Freight"
	}
	weight := ""
	if quote.Weight > 0 {
		weight = strconv.FormatFloat(quote.Weight, 'f', 0, 64)
	}
	rate := fmt.Sprintf("$%.2f", quote.QuotedRate)
	
	values := []string{route, quote.EquipmentType, weight, commodity, rate}
	
	for i, value := range values {
		alignment := "L"
		if i == 2 || i == 4 { // Weight and Rate columns - right align
			alignment = "R"
		}
		pdf.CellFormat(colWidths[i], 8, value, "1", 0, alignment, true, 0, "")
	}
	pdf.Ln(15)

	// Pickup Date
	if quote.PickupDate != nil {
		pdf.SetFont("Arial", "B", 10)
		pdf.Cell(40, 6, "Requested Pickup:")
		pdf.SetFont("Arial", "", 10)
		pdf.Cell(60, 6, quote.PickupDate.Format("January 2, 2006"))
		pdf.Ln(10)
	}

	// Total Section
	pdf.SetFont("Arial", "B", 14)
	totalY := pdf.GetY()
	pdf.SetXY(120, totalY)
	pdf.Cell(40, 10, "Total Quoted Rate:")
	pdf.Cell(30, 10, fmt.Sprintf("$%.2f", quote.QuotedRate))
	pdf.Ln(20)

	// Terms and Conditions
	pdf.SetFont("Arial", "B", 10)
	pdf.Cell(0, 8, "Terms and Conditions:")
	pdf.Ln(6)
	pdf.SetFont("Arial", "", 9)
	
	terms := []string{
		"• This quote is valid until the date specified above",
		"• Rates are subject to change based on market conditions",
		"• Additional charges may apply for special handling requirements",
		"• Payment terms will be established upon booking confirmation",
		"• All shipments subject to our standard terms and conditions",
	}
	
	for _, term := range terms {
		pdf.Cell(0, 5, term)
		pdf.Ln(5)
	}
	pdf.Ln(5)

	// Notes
	if quote.Notes != "" {
		pdf.SetFont("Arial", "B", 10)
		pdf.Cell(0, 8, "Additional Notes:")
		pdf.Ln(6)
		pdf.SetFont("Arial", "", 10)
		pdf.MultiCell(0, 6, quote.Notes, "", "", false)
		pdf.Ln(5)
	}

	// Footer
	pdf.Ln(10)
	pdf.SetFont("Arial", "I", 8)
	pdf.SetTextColor(128, 128, 128)
	pdf.Cell(0, 6, "Thank you for considering EverFlown Logistics for your freight needs!")
	pdf.Ln(4)
	pdf.Cell(0, 6, "Contact us to book this shipment or discuss your requirements.")

	var buf bytes.Buffer
	err := pdf.Output(&buf)
	if err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}