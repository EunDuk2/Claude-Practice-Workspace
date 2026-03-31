// 견적서 항목 데이터 타입
export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

// 견적서 데이터 타입
export interface Invoice {
  id: string
  title: string
  clientName: string
  issueDate: string // ISO 8601 형식
  dueDate: string // ISO 8601 형식
  status: string // Draft, Sent, Accepted 등
  totalAmount: number
  currency: string // KRW, USD 등
  items: InvoiceItem[]
}
