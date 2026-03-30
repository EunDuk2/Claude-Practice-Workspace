const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 오류 수집 배열
const errors = [];
const screenshotsDir = './test-screenshots';

// 스크린샷 디렉토리 생성
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function captureScreenshot(page, name) {
  const filename = path.join(screenshotsDir, `${name}.png`);
  await page.screenshot({ path: filename });
  console.log(`✓ 스크린샷 저장: ${filename}`);
  return filename;
}

async function checkForErrors(page, pageName) {
  // 콘솔 에러 확인
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // 네트워크 오류 확인
  let pageErrors = [];
  page.on('response', (response) => {
    if (response.status() >= 400) {
      pageErrors.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
      });
    }
  });

  // 페이지 크래시 확인
  page.on('crash', () => {
    errors.push({
      page: pageName,
      type: 'CRASH',
      message: '페이지 크래시 발생',
    });
  });
}

async function testDashboard() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const baseUrl = 'http://localhost:3000';

  try {
    console.log('🌐 브라우저 오토메이션 시작...\n');

    // 1. 홈페이지 접속
    console.log('📍 1단계: 홈페이지 접속');
    await page.goto(baseUrl);
    await page.waitForTimeout(1000);
    await captureScreenshot(page, '01-homepage');

    // 2. 대시보드 접속
    console.log('\n📍 2단계: 대시보드 페이지 접속');
    await page.goto(`${baseUrl}/dashboard`);
    await page.waitForTimeout(1000);
    await captureScreenshot(page, '02-dashboard-main');

    // 페이지 텍스트 확인
    const dashboardTitle = await page.textContent('h1') || 'N/A';
    console.log(`   제목: ${dashboardTitle}`);

    // 3. 분석(Analytics) 탭 클릭
    console.log('\n📍 3단계: 사이드바에서 분석(Analytics) 링크 클릭');
    await checkForErrors(page, 'Analytics');

    // 사이드바 링크 찾기
    const analyticsLink = await page.locator('a[href="/analytics"]');
    if (await analyticsLink.count() > 0) {
      await analyticsLink.click();
      await page.waitForTimeout(1500);
      await captureScreenshot(page, '03-analytics-page');

      const analyticsTitle = await page.textContent('h1') || 'N/A';
      console.log(`   ✓ 분석 페이지 로드됨 - 제목: ${analyticsTitle}`);

      // 분석 페이지에서 오류 확인
      const pageContent = await page.content();
      if (pageContent.includes('404') || pageContent.includes('not found')) {
        errors.push({
          page: 'Analytics',
          type: 'PAGE_LOAD_ERROR',
          message: '404 오류 페이지 표시',
          url: page.url(),
        });
      }
    } else {
      errors.push({
        page: 'Analytics',
        type: 'LINK_NOT_FOUND',
        message: '사이드바에서 분석 링크를 찾을 수 없음',
      });
    }

    // 4. 대시보드로 돌아가기
    console.log('\n📍 4단계: 대시보드로 돌아가기');
    await page.goto(`${baseUrl}/dashboard`);
    await page.waitForTimeout(1000);

    // 5. 설정(Settings) 탭 클릭
    console.log('\n📍 5단계: 사이드바에서 설정(Settings) 링크 클릭');
    await checkForErrors(page, 'Settings');

    const settingsLink = await page.locator('a[href="/settings"]');
    if (await settingsLink.count() > 0) {
      await settingsLink.click();
      await page.waitForTimeout(1500);
      await captureScreenshot(page, '04-settings-page');

      const settingsTitle = await page.textContent('h1') || 'N/A';
      console.log(`   ✓ 설정 페이지 로드됨 - 제목: ${settingsTitle}`);

      // 설정 페이지에서 오류 확인
      const pageContent = await page.content();
      if (pageContent.includes('404') || pageContent.includes('not found')) {
        errors.push({
          page: 'Settings',
          type: 'PAGE_LOAD_ERROR',
          message: '404 오류 페이지 표시',
          url: page.url(),
        });
      }
    } else {
      errors.push({
        page: 'Settings',
        type: 'LINK_NOT_FOUND',
        message: '사이드바에서 설정 링크를 찾을 수 없음',
      });
    }

    // 6. 설정 페이지 탭 테스트
    console.log('\n📍 6단계: 설정 페이지 탭 상호작용 테스트');
    const tabs = await page.locator('button[role="tab"]');
    const tabCount = await tabs.count();
    console.log(`   발견된 탭: ${tabCount}개`);

    if (tabCount > 0) {
      // 알림 탭 클릭
      try {
        const notificationsTab = await page.locator('text=알림');
        if (await notificationsTab.count() > 0) {
          await notificationsTab.click();
          await page.waitForTimeout(500);
          await captureScreenshot(page, '05-settings-notifications-tab');
          console.log('   ✓ 알림 탭 활성화');
        }
      } catch (e) {
        console.log(`   ⚠ 알림 탭 클릭 실패: ${e.message}`);
      }

      // 보안 탭 클릭
      try {
        const securityTab = await page.locator('text=보안');
        if (await securityTab.count() > 0) {
          await securityTab.click();
          await page.waitForTimeout(500);
          await captureScreenshot(page, '06-settings-security-tab');
          console.log('   ✓ 보안 탭 활성화');
        }
      } catch (e) {
        console.log(`   ⚠ 보안 탭 클릭 실패: ${e.message}`);
      }
    }

    // 7. 대시보드의 내부 탭 테스트
    console.log('\n📍 7단계: 대시보드 내부 탭 상호작용 테스트');
    await page.goto(`${baseUrl}/dashboard`);
    await page.waitForTimeout(1000);

    try {
      const dashboardTabs = await page.locator('button[role="tab"]');
      const dashboardTabCount = await dashboardTabs.count();
      console.log(`   발견된 탭: ${dashboardTabCount}개`);

      if (dashboardTabCount > 1) {
        // 분석 탭 클릭
        const analyticsDashboardTab = await page.locator('text=분석');
        if (await analyticsDashboardTab.count() > 0) {
          await analyticsDashboardTab.click();
          await page.waitForTimeout(500);
          await captureScreenshot(page, '07-dashboard-analytics-tab');
          console.log('   ✓ 대시보드 분석 탭 활성화');
        }
      }
    } catch (e) {
      console.log(`   ⚠ 대시보드 탭 상호작용 실패: ${e.message}`);
    }

    // 8. 다크모드 테스트
    console.log('\n📍 8단계: 테마 토글 테스트');
    try {
      const themeToggle = await page.locator('button[aria-label*="theme"], button[aria-label*="어두운"]');
      if (await themeToggle.count() > 0) {
        await themeToggle.click();
        await page.waitForTimeout(500);
        await captureScreenshot(page, '08-dark-mode');
        console.log('   ✓ 테마 토글 작동');
      }
    } catch (e) {
      console.log(`   ⚠ 테마 토글 미발견`);
    }

    // 9. 반응형 디자인 테스트
    console.log('\n📍 9단계: 모바일 반응형 테스트');
    await page.setViewportSize({ width: 375, height: 667 });
    await captureScreenshot(page, '09-mobile-view');
    console.log('   ✓ 모바일 뷰 확인 (375x667)');

    // 데스크톱으로 복구
    await page.setViewportSize({ width: 1280, height: 720 });

  } catch (error) {
    errors.push({
      page: 'General',
      type: 'UNEXPECTED_ERROR',
      message: error.message,
    });
    console.error('❌ 오류 발생:', error.message);
  } finally {
    await browser.close();

    // 결과 출력
    console.log('\n' + '='.repeat(80));
    console.log('📋 테스트 완료');
    console.log('='.repeat(80));

    if (errors.length === 0) {
      console.log('\n✅ 모든 테스트 통과! 오류가 발견되지 않았습니다.\n');
    } else {
      console.log(`\n⚠️  총 ${errors.length}개의 오류가 발견되었습니다:\n`);
      errors.forEach((error, index) => {
        console.log(`${index + 1}. [${error.page}] ${error.type}`);
        console.log(`   메시지: ${error.message}`);
        if (error.url) console.log(`   URL: ${error.url}`);
        console.log();
      });
    }

    console.log(`\n📸 스크린샷 위치: ${screenshotsDir}/\n`);
  }
}

testDashboard();
