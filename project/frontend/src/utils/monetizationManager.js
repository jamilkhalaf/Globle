// Monetization Management System
class MonetizationManager {
  constructor() {
    this.adFrequency = {
      header: { interval: 300000, lastShown: 0 }, // 5 minutes
      sidebar: { interval: 900000, lastShown: 0 }, // 15 minutes - longer for sidebar
      leftSidebar: { interval: 900000, lastShown: 0 }, // 15 minutes
      rightSidebar: { interval: 900000, lastShown: 0 }, // 15 minutes
      inContent: { interval: 180000, lastShown: 0 }, // 3 minutes
      footer: { interval: 300000, lastShown: 0 }, // 5 minutes
      mobile: { interval: 240000, lastShown: 0 }, // 4 minutes
      gameCompletion: { interval: 120000, lastShown: 0 } // 2 minutes
    };
    
    this.userPreferences = this.loadUserPreferences();
    this.adBlocked = false;
    this.impressionCount = 0;
    this.maxDailyImpressions = 50; // Limit ads per day per user
    this.fallbackContent = this.getFallbackContent();
    this.currentPage = window.location.pathname;
    this.pageAdHistory = this.loadPageAdHistory();
    
    this.checkAdBlocker();
    this.setupNavigationListener();
  }

  // Setup listener for page navigation
  setupNavigationListener() {
    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', () => {
      this.currentPage = window.location.pathname;
      this.handlePageChange();
    });

    // Override pushState to detect programmatic navigation
    const originalPushState = history.pushState;
    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.currentPage = window.location.pathname;
      this.handlePageChange();
    };
  }

  // Handle page changes
  handlePageChange() {
    console.log('Page changed to:', this.currentPage);
    // Reset some ad frequencies on page change to allow ads on new pages
    this.resetPageSpecificAds();
  }

  // Reset ads that should be available on new pages
  resetPageSpecificAds() {
    // Allow header and sidebar ads to show on new pages
    this.adFrequency.header.lastShown = 0;
    this.adFrequency.sidebar.lastShown = 0;
    this.adFrequency.leftSidebar.lastShown = 0;
    this.adFrequency.rightSidebar.lastShown = 0;
    
    // Keep content ads with their intervals to avoid spam
    // this.adFrequency.inContent.lastShown = 0; // Uncomment if you want content ads on every page
  }

  // Load page-specific ad history
  loadPageAdHistory() {
    try {
      const history = localStorage.getItem('pageAdHistory');
      return history ? JSON.parse(history) : {};
    } catch (error) {
      return {};
    }
  }

  // Save page-specific ad history
  savePageAdHistory() {
    try {
      localStorage.setItem('pageAdHistory', JSON.stringify(this.pageAdHistory));
    } catch (error) {
      console.error('Error saving page ad history:', error);
    }
  }

  // Check if ad blocker is active with multiple detection methods
  checkAdBlocker() {
    // Always allow ads to show, even with ad blockers
    this.adBlocked = false;
    return;
    
    // Method 1: Test ad element
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox';
    testAd.style.position = 'absolute';
    testAd.style.left = '-9999px';
    testAd.style.top = '-9999px';
    document.body.appendChild(testAd);
    
    setTimeout(() => {
      if (testAd.offsetHeight === 0) {
        this.adBlocked = true;
        console.log('Ad blocker detected via element test');
      }
      document.body.removeChild(testAd);
    }, 100);

    // Method 2: Test AdSense script loading
    const testScript = document.createElement('script');
    testScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    testScript.async = true;
    
    testScript.onerror = () => {
      this.adBlocked = true;
      console.log('Ad blocker detected via script loading test');
    };
    
    testScript.onload = () => {
      // Script loaded successfully, but still check if ads are blocked
      setTimeout(() => {
        if (typeof window.adsbygoogle === 'undefined') {
          this.adBlocked = true;
          console.log('Ad blocker detected via AdSense availability test');
        }
      }, 1000);
    };
    
    document.head.appendChild(testScript);
  }

  // Get fallback content for when ads are blocked
  getFallbackContent() {
    return {
      header: {
        title: "Support Our Games",
        message: "Consider disabling your ad blocker to support free game development",
        cta: "Learn More"
      },
      sidebar: {
        title: "Enjoying the Games?",
        message: "Help us keep these games free by allowing ads or making a donation",
        cta: "Support Us"
      },
      leftSidebar: {
        title: "Support Development",
        message: "Your support helps us create more educational games",
        cta: "Learn More"
      },
      rightSidebar: {
        title: "Keep Games Free",
        message: "Consider supporting us to maintain free access",
        cta: "Support Us"
      },
      inContent: {
        title: "Enjoying the Games?",
        message: "Help us keep these games free by allowing ads or making a donation",
        cta: "Support Us"
      },
      footer: {
        title: "Thank You for Playing",
        message: "Your support helps us create more educational games",
        cta: "Share with Friends"
      },
      gameCompletion: {
        title: "Great Job!",
        message: "You've completed the game! Consider supporting us to keep games free",
        cta: "Play Again"
      }
    };
  }

  // Load user preferences from localStorage
  loadUserPreferences() {
    try {
      const prefs = localStorage.getItem('monetizationPreferences');
      return prefs ? JSON.parse(prefs) : {
        adFrequency: 'normal', // low, normal, high
        showAds: true,
        lastImpressionDate: null,
        dailyImpressionCount: 0,
        showFallbackContent: true
      };
    } catch (error) {
      return {
        adFrequency: 'normal',
        showAds: true,
        lastImpressionDate: null,
        dailyImpressionCount: 0,
        showFallbackContent: true
      };
    }
  }

  // Save user preferences
  saveUserPreferences() {
    try {
      localStorage.setItem('monetizationPreferences', JSON.stringify(this.userPreferences));
    } catch (error) {
      console.error('Error saving monetization preferences:', error);
    }
  }

  // Check if ad should be shown based on frequency and user preferences
  shouldShowAd(adType, adSlot = null) {
    // Always show ads, regardless of ad blocker or other restrictions
    return true;
    
    if (!this.userPreferences.showAds) {
      return false;
    }

    // If ad blocker is active, show fallback content instead
    if (this.adBlocked) {
      return 'fallback';
    }

    // Check daily impression limit
    const today = new Date().toDateString();
    if (this.userPreferences.lastImpressionDate !== today) {
      this.userPreferences.dailyImpressionCount = 0;
      this.userPreferences.lastImpressionDate = today;
    }

    if (this.userPreferences.dailyImpressionCount >= this.maxDailyImpressions) {
      return false;
    }

    // Check frequency interval
    const now = Date.now();
    const adConfig = this.adFrequency[adType];
    
    if (!adConfig) {
      return true; // Unknown ad type, allow it
    }

    // Adjust interval based on user preference
    let interval = adConfig.interval;
    if (this.userPreferences.adFrequency === 'low') {
      interval *= 2;
    } else if (this.userPreferences.adFrequency === 'high') {
      interval *= 0.5;
    }

    // Check if this specific ad slot was shown recently on this page
    const pageKey = `${this.currentPage}-${adSlot}`;
    const lastShownOnPage = this.pageAdHistory[pageKey] || 0;
    
    // Use the more restrictive of global frequency or page-specific frequency
    const timeSinceGlobal = now - adConfig.lastShown;
    const timeSincePage = now - lastShownOnPage;
    
    // For sidebar and header ads, be more lenient on page changes
    if ((adType === 'sidebar' || adType === 'header' || adType === 'leftSidebar' || adType === 'rightSidebar') && 
        this.currentPage !== this.lastCheckedPage) {
      // Allow sidebar/header ads on new pages more frequently
      if (timeSinceGlobal < interval * 0.3) { // 30% of normal interval
        return false;
      }
    } else {
      // Normal frequency check
      if (timeSinceGlobal < interval) {
        return false;
      }
    }

    // Update last checked page
    this.lastCheckedPage = this.currentPage;

    return true;
  }

  // Mark ad as shown
  markAdShown(adType, adSlot = null) {
    if (this.adFrequency[adType]) {
      this.adFrequency[adType].lastShown = Date.now();
    }
    
    // Track page-specific ad history
    if (adSlot) {
      const pageKey = `${this.currentPage}-${adSlot}`;
      this.pageAdHistory[pageKey] = Date.now();
      this.savePageAdHistory();
    }
    
    this.userPreferences.dailyImpressionCount++;
    this.impressionCount++;
    this.saveUserPreferences();
  }

  // Track ad click
  trackAdClick(adType) {
    console.log(`Ad clicked: ${adType}`);
    
    if (window.gtag) {
      window.gtag('event', 'ad_click', {
        'ad_type': adType,
        'page_location': window.location.href
      });
    }
  }

  // Track ad impression
  trackAdImpression(adType) {
    console.log(`Ad impression: ${adType}`);
    
    if (window.gtag) {
      window.gtag('event', 'ad_impression', {
        'ad_type': adType,
        'page_location': window.location.href
      });
    }
  }

  // Track fallback content interaction
  trackFallbackInteraction(adType, action) {
    console.log(`Fallback interaction: ${adType} - ${action}`);
    
    if (window.gtag) {
      window.gtag('event', 'fallback_interaction', {
        'ad_type': adType,
        'action': action,
        'page_location': window.location.href
      });
    }
  }

  // Update user preferences
  updatePreferences(preferences) {
    this.userPreferences = { ...this.userPreferences, ...preferences };
    this.saveUserPreferences();
  }

  // Get ad revenue statistics (mock data - replace with real analytics)
  getRevenueStats() {
    return {
      totalImpressions: this.impressionCount,
      estimatedRevenue: this.impressionCount * 0.01, // Rough estimate $0.01 per impression
      dailyImpressions: this.userPreferences.dailyImpressionCount,
      adBlocked: this.adBlocked,
      fallbackShown: this.adBlocked ? this.impressionCount : 0,
      currentPage: this.currentPage
    };
  }

  // Reset daily counters (call this at midnight)
  resetDailyCounters() {
    this.userPreferences.dailyImpressionCount = 0;
    this.saveUserPreferences();
  }

  // Get fallback content for specific ad type
  getFallbackContentForType(adType) {
    return this.fallbackContent[adType] || this.fallbackContent.inContent;
  }

  // Check if user has premium/paid account (for future implementation)
  hasPremiumAccount() {
    // This could check for premium subscription or one-time payment
    return localStorage.getItem('premiumUser') === 'true';
  }

  // Show donation prompt
  showDonationPrompt() {
    // This could open a donation modal or redirect to payment page
    console.log('Showing donation prompt');
    // Example: window.open('https://your-donation-page.com', '_blank');
  }

  // Show ad blocker detection message
  showAdBlockerMessage() {
    if (this.adBlocked && this.userPreferences.showFallbackContent) {
      return {
        title: "Ad Blocker Detected",
        message: "We notice you're using an ad blocker. Our games are free thanks to advertising revenue. Consider:",
        options: [
          "Disabling your ad blocker for this site",
          "Making a small donation to support development",
          "Sharing our games with friends"
        ]
      };
    }
    return null;
  }

  // Get current page
  getCurrentPage() {
    return this.currentPage;
  }

  // Force refresh ads (useful for testing)
  forceRefreshAds() {
    Object.keys(this.adFrequency).forEach(key => {
      this.adFrequency[key].lastShown = 0;
    });
    this.pageAdHistory = {};
    this.savePageAdHistory();
    console.log('Ads refreshed');
  }
}

// Create singleton instance
const monetizationManager = new MonetizationManager();

export default monetizationManager; 