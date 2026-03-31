/**
 * Notion API 연동 테스트
 *
 * 이 파일은 Notion API 설정 및 연동 검증을 위한 테스트입니다.
 * 실행하기 전에 .env.local에 유효한 NOTION_API_KEY와 NOTION_DATABASE_ID를 설정하세요.
 */

import { validateDatabaseSchema } from '../notion'

/**
 * 테스트 1: 환경변수 로드 검증
 * .env.local에서 환경변수를 올바르게 로드했는지 확인합니다.
 */
export function testEnvironmentVariables(): void {
  console.log('🧪 테스트 1: 환경변수 로드 검증')

  const notionApiKey = process.env.NOTION_API_KEY
  const notionDatabaseId = process.env.NOTION_DATABASE_ID
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  if (!notionApiKey) {
    console.error('❌ NOTION_API_KEY가 설정되지 않았습니다.')
    return
  }

  if (!notionDatabaseId) {
    console.error('❌ NOTION_DATABASE_ID가 설정되지 않았습니다.')
    return
  }

  if (!baseUrl) {
    console.error('❌ NEXT_PUBLIC_BASE_URL이 설정되지 않았습니다.')
    return
  }

  console.log('✅ 모든 필수 환경변수가 설정되었습니다.')
  console.log(`   - NOTION_API_KEY: ${notionApiKey.substring(0, 10)}...`)
  console.log(`   - NOTION_DATABASE_ID: ${notionDatabaseId}`)
  console.log(`   - NEXT_PUBLIC_BASE_URL: ${baseUrl}`)
}

/**
 * 테스트 2: Notion 데이터베이스 스키마 검증
 * Notion 데이터베이스에서 필수 속성 필드를 확인합니다.
 */
export async function testDatabaseSchema(): Promise<void> {
  console.log('\n🧪 테스트 2: Notion 데이터베이스 스키마 검증')

  try {
    const isValid = await validateDatabaseSchema()
    if (isValid) {
      console.log('✅ 데이터베이스 스키마 검증 완료')
    } else {
      console.error('❌ 데이터베이스 스키마에 문제가 있습니다.')
    }
  } catch (error) {
    console.error('❌ 데이터베이스 스키마 검증 중 오류 발생:', error)
  }
}

/**
 * 모든 테스트 실행
 */
export async function runAllTests(): Promise<void> {
  console.log('=== Notion API 연동 테스트 시작 ===\n')

  testEnvironmentVariables()
  await testDatabaseSchema()

  console.log('\n=== 테스트 완료 ===')
}
