import { Client } from '@notionhq/client'

/**
 * 환경변수 유효성 검증
 */
function validateEnvironmentVariables(): void {
  const requiredVars = ['NOTION_API_KEY', 'NOTION_DATABASE_ID']
  const missingVars = requiredVars.filter(key => !process.env[key])

  if (missingVars.length > 0) {
    throw new Error(
      `필수 환경변수가 설정되지 않았습니다: ${missingVars.join(', ')}`
    )
  }
}

/**
 * Notion API 클라이언트 초기화
 */
function initNotionClient(): Client {
  validateEnvironmentVariables()

  return new Client({
    auth: process.env.NOTION_API_KEY,
  })
}

/**
 * Notion 데이터베이스 스키마 검증
 * 필수 속성 필드 확인: Title, Text, Date, Select, Number, RichText
 */
export async function validateDatabaseSchema(): Promise<boolean> {
  const notion = initNotionClient()
  const databaseId = process.env.NOTION_DATABASE_ID!

  try {
    const response = await notion.databases.retrieve({
      database_id: databaseId,
    })

    // Notion API 응답의 properties 속성 접근
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const database = response as any

    // 필수 속성 확인
    const requiredProperties = [
      'Title', // 제목
      'clientName', // 고객명
      'issueDate', // 발행일
      'dueDate', // 유효기간
      'status', // 상태
      'totalAmount', // 총액
      'currency', // 통화
      'items', // 항목 내역
    ]

    const databaseProperties = database.properties
      ? Object.keys(database.properties)
      : []
    const hasAllProperties = requiredProperties.every(prop =>
      databaseProperties.includes(prop)
    )

    if (!hasAllProperties) {
      const missingProps = requiredProperties.filter(
        prop => !databaseProperties.includes(prop)
      )
      console.error(`누락된 속성: ${missingProps.join(', ')}`)
      return false
    }

    console.log('✅ Notion 데이터베이스 스키마 검증 성공')
    return true
  } catch (error) {
    console.error('❌ Notion 데이터베이스 스키마 검증 실패:', error)
    throw error
  }
}

/**
 * Notion 클라이언트 내보내기
 */
export const notion = initNotionClient()
