const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 오류 수집 배열
const errors = [];
const screenshotsDir = './test-screenshots';
let stepCount = 1;

// 스크린샷 디렉토리 생성
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function captureScreenshot(page, name, description) {
  const filename = path.join(screenshotsDir, `${stepCount.toString().padStart(2, '0')}-${name}.png`);
  await page.screenshot({ path: filename, fullPage: false });
  console.log(`   📸 스크린샷: ${description}`);
  stepCount++;
  return filename;
}

async function checkPageStatus(page, pageName) {
  const status = page.url().includes('not-found') || page.url().includes('404');
  const title = await page.title();
  const h1Text = await page.locator('h1').first().textContent().catch(() => null);

  return {
    isError: status,
    title,
    h1: h1Text,
    url: page.url(),
  };
}

async function testDashboard() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const baseUrl = 'http://localhost:3000';
  const collectedErrors = [];

  try {
    console.log('\n' + '='.repeat(80));
    console.log('🌐 Playwright 브라우저 테스트 시작 (Chrome)');
    console.log('='.repeat(80) + '\n');

    // 1. 홈페이지 접속
    console.log('📍 STEP 1: 홈페이지 접속 (/)');
    await page.goto(baseUrl);
    await page.waitForTimeout(1500);
    const homeTitle = await page.title();
    console.log(`   페이지 제목: ${homeTitle}`);
    await captureScreenshot(page, 'homepage', '홈페이지');

    // 2. 대시보드 접속
    console.log('\n📍 STEP 2: 대시보드 페이지 접속 (/dashboard)');
    await page.goto(`${baseUrl}/dashboard`);
    await page.waitForTimeout(1500);
    let status = await checkPageStatus(page, 'Dashboard');
    console.log(`   제목: ${status.h1}`);
    console.log(`   URL: ${status.url}`);
    if (!status.isError) {
      console.log(`   ✅ 대시보드 정상 로드됨`);
    } else {
      console.log(`   ❌ 오류: 대시보드 404 페이지 표시`);
      collectedErrors.push({
        page: '/dashboard',
        type: '404_ERROR',
        title: status.title,
        h1: status.h1,
        description: '대시보드 페이지 404 오류',
      });
    }
    await captureScreenshot(page, 'dashboard-main', '대시보드 메인');

    // 3. 분석(Analytics) 페이지 직접 접속
    console.log('\n📍 STEP 3: 분석 페이지 직접 접속 (/analytics)');
    await page.goto(`${baseUrl}/analytics`);
    await page.waitForTimeout(1500);
    status = await checkPageStatus(page, 'Analytics');
    console.log(`   제목: ${status.h1}`);
    console.log(`   URL: ${status.url}`);
    if (!status.isError && status.h1 && status.h1.includes('분석')) {
      console.log(`   ✅ 분석 페이지 정상 로드됨`);
    } else {
      console.log(`   ❌ 오류: 분석 페이지 404 또는 잘못된 콘텐츠`);
      collectedErrors.push({
        page: '/analytics',
        type: '404_ERROR',
        title: status.title,
        h1: status.h1,
        description: '분석 페이지 로드 실패 또는 404',
      });
    }
    await captureScreenshot(page, 'analytics-page', '분석 페이지');

    // 3-1. 분석 페이지의 탭 상호작용
    console.log('\n📍 STEP 3-1: 분석 페이지 탭 상호작용');
    const analyticsTabs = await page.locator('button[role="tab"]');
    const analyticsTabCount = await analyticsTabs.count();
    console.log(`   발견된 탭: ${analyticsTabCount}개`);

    if (analyticsTabCount >= 2) {
      try {
        // 두 번째 탭 클릭
        const secondTab = analyticsTabs.nth(1);
        const secondTabText = await secondTab.textContent();
        console.log(`   탭 "${secondTabText}" 클릭 중...`);
        await secondTab.click();
        await page.waitForTimeout(500);
        console.log(`   ✅ 탭 상호작용 성공`);
        await captureScreenshot(page, 'analytics-tab2', `분석 페이지 탭 2 (${secondTabText})`);
      } catch (e) {
        console.log(`   ⚠️ 탭 클릭 실패: ${e.message.substring(0, 50)}`);
        collectedErrors.push({
          page: '/analytics',
          type: 'TAB_INTERACTION_ERROR',
          description: '분석 페이지 탭 상호작용 실패',
          error: e.message.substring(0, 100),
        });
      }
    }

    // 4. 대시보드로 돌아가기
    console.log('\n📍 STEP 4: 대시보드로 돌아가기');
    await page.goto(`${baseUrl}/dashboard`);
    await page.waitForTimeout(1500);
    console.log(`   ✅ 대시보드 재로드됨`);

    // 5. 설정(Settings) 페이지 직접 접속
    console.log('\n📍 STEP 5: 설정 페이지 직접 접속 (/settings)');
    await page.goto(`${baseUrl}/settings`);
    await page.waitForTimeout(1500);
    status = await checkPageStatus(page, 'Settings');
    console.log(`   제목: ${status.h1}`);
    console.log(`   URL: ${status.url}`);
    if (!status.isError && status.h1 && status.h1.includes('설정')) {
      console.log(`   ✅ 설정 페이지 정상 로드됨`);
    } else {
      console.log(`   ❌ 오류: 설정 페이지 404 또는 잘못된 콘텐츠`);
      collectedErrors.push({
        page: '/settings',
        type: '404_ERROR',
        title: status.title,
        h1: status.h1,
        description: '설정 페이지 로드 실패 또는 404',
      });
    }
    await captureScreenshot(page, 'settings-page', '설정 페이지');

    // 5-1. 설정 페이지의 탭 상호작용
    console.log('\n📍 STEP 5-1: 설정 페이지 탭 상호작용');
    const settingsTabs = await page.locator('button[role="tab"]');
    const settingsTabCount = await settingsTabs.count();
    console.log(`   발견된 탭: ${settingsTabCount}개`);

    if (settingsTabCount >= 2) {
      try {
        // 두 번째 탭 (알림) 클릭
        const notificationsTab = settingsTabs.nth(1);
        const notificationsTabText = await notificationsTab.textContent();
        console.log(`   탭 "${notificationsTabText}" 클릭 중...`);
        await notificationsTab.click();
        await page.waitForTimeout(500);
        console.log(`   ✅ 알림 탭 활성화됨`);
        await captureScreenshot(page, 'settings-notifications', '설정 - 알림 탭');
      } catch (e) {
        console.log(`   ⚠️ 탭 클릭 실패: ${e.message.substring(0, 50)}`);
        collectedErrors.push({
          page: '/settings',
          type: 'TAB_INTERACTION_ERROR',
          description: '설정 페이지 알림 탭 클릭 실패',
          error: e.message.substring(0, 100),
        });
      }

      try {
        // 세 번째 탭 (보안) 클릭
        const securityTab = settingsTabs.nth(2);
        const securityTabText = await securityTab.textContent();
        console.log(`   탭 "${securityTabText}" 클릭 중...`);
        await securityTab.click();
        await page.waitForTimeout(500);
        console.log(`   ✅ 보안 탭 활성화됨`);
        await captureScreenshot(page, 'settings-security', '설정 - 보안 탭');
      } catch (e) {
        console.log(`   ⚠️ 탭 클릭 실패: ${e.message.substring(0, 50)}`);
        collectedErrors.push({
          page: '/settings',
          type: 'TAB_INTERACTION_ERROR',
          description: '설정 페이지 보안 탭 클릭 실패',
          error: e.message.substring(0, 100),
        });
      }
    }

    // 6. 대시보드의 내부 탭 테스트
    console.log('\n📍 STEP 6: 대시보드 내부 탭 상호작용 테스트');
    await page.goto(`${baseUrl}/dashboard`);
    await page.waitForTimeout(1500);

    const dashboardTabs = await page.locator('button[role="tab"]');
    const dashboardTabCount = await dashboardTabs.count();
    console.log(`   발견된 탭: ${dashboardTabCount}개`);

    if (dashboardTabCount >= 2) {
      try {
        // 두 번째 탭 (분석) 클릭
        const dashAnalyticsTab = dashboardTabs.nth(1);
        const dashAnalyticsTabText = await dashAnalyticsTab.textContent();
        console.log(`   탭 "${dashAnalyticsTabText}" 클릭 중...`);
        await dashAnalyticsTab.click();
        await page.waitForTimeout(500);
        console.log(`   ✅ 대시보드 분석 탭 활성화됨`);
        await captureScreenshot(page, 'dashboard-analytics-tab', `대시보드 - ${dashAnalyticsTabText} 탭`);
      } catch (e) {
        console.log(`   ⚠️ 탭 클릭 실패: ${e.message.substring(0, 50)}`);
      }
    }

    // 7. 사이드바 네비게이션 테스트
    console.log('\n📍 STEP 7: 사이드바 네비게이션 링크 확인');
    const navLinks = await page.locator('a[href*="/"]').all();
    console.log(`   발견된 네비게이션 링크: ${navLinks.length}개`);

    const importantLinks = await Promise.all([
      page.locator('a[href="/dashboard"]').count(),
      page.locator('a[href="/analytics"]').count(),
      page.locator('a[href="/settings"]').count(),
    ]);
    console.log(`   - /dashboard 링크: ${importantLinks[0] > 0 ? '✅' : '❌'}`);
    console.log(`   - /analytics 링크: ${importantLinks[1] > 0 ? '✅' : '❌'}`);
    console.log(`   - /settings 링크: ${importantLinks[2] > 0 ? '✅' : '❌'}`);

    // 8. 사이드바 클릭으로 네비게이션 테스트
    console.log('\n📍 STEP 8: 사이드바 링크 클릭 네비게이션 테스트');
    try {
      const analyticsLink = page.locator('a[href="/analytics"]').first();
      console.log(`   분석 링크 클릭 중...`);
      await analyticsLink.click();
      await page.waitForTimeout(1500);
      status = await checkPageStatus(page, 'Analytics from sidebar');
      console.log(`   현재 URL: ${status.url}`);
      if (status.url.includes('/analytics')) {
        console.log(`   ✅ 분석 페이지로 정상 이동됨`);
      }
      await captureScreenshot(page, 'sidebar-analytics-nav', '사이드바를 통한 분석 페이지 이동');
    } catch (e) {
      console.log(`   ❌ 분석 링크 클릭 실패: ${e.message.substring(0, 50)}`);
      collectedErrors.push({
        page: 'Navigation',
        type: 'LINK_CLICK_ERROR',
        description: '사이드바 분석 링크 클릭 실패',
      });
    }

    // 9. 모바일 반응형 테스트
    console.log('\n📍 STEP 9: 반응형 디자인 테스트');
    console.log(`   현재 뷰포트: 1280x720 (데스크톱)`);
    await page.goto(`${baseUrl}/dashboard`);
    await page.waitForTimeout(1000);

    // 모바일 뷰포트로 변경
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    console.log(`   모바일 뷰포트로 변경: 375x667`);
    await captureScreenshot(page, 'mobile-view', '모바일 뷰 (375x667)');

    // 태블릿 뷰포트로 변경
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    console.log(`   태블릿 뷰포트로 변경: 768x1024`);
    await captureScreenshot(page, 'tablet-view', '태블릿 뷰 (768x1024)');

    console.log(`   ✅ 반응형 디자인 테스트 완료`);

  } catch (error) {
    console.error('❌ 예상치 못한 오류 발생:', error.message);
    collectedErrors.push({
      page: 'General',
      type: 'UNEXPECTED_ERROR',
      description: error.message,
    });
  } finally {
    await browser.close();

    // 최종 결과 출력
    console.log('\n' + '='.repeat(80));
    console.log('📋 테스트 완료 - 오류 분석 보고서');
    console.log('='.repeat(80));

    if (collectedErrors.length === 0) {
      console.log('\n✅ 모든 테스트 통과! 오류가 발견되지 않았습니다.\n');
    } else {
      console.log(`\n⚠️  총 ${collectedErrors.length}개의 오류가 발견되었습니다:\n`);
      collectedErrors.forEach((error, index) => {
        console.log(`${index + 1}. [${error.page}] ${error.type}`);
        console.log(`   설명: ${error.description}`);
        if (error.h1) console.log(`   페이지 제목: ${error.h1}`);
        if (error.title) console.log(`   브라우저 제목: ${error.title}`);
        if (error.error) console.log(`   에러: ${error.error}`);
        console.log();
      });
    }

    console.log(`📸 스크린샷 저장 위치: ${path.resolve(screenshotsDir)}/\n`);
  }
}

testDashboard();
