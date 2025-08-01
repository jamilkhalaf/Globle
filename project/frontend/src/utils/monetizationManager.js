// Monetization Management System
class MonetizationManager {
  constructor() {
    this.adFrequency = {
      header: { daily: 3, hourly: 1 },
      sidebar: { daily: 5, hourly: 2 },
      inContent: { daily: 8, hourly: 3 },
      footer: { daily: 3, hourly: 1 },
      mobile: { daily: 10, hourly: 4 },
      gameCompletion: { daily: 5, hourly: 2 }
    };
    
    this.adHistory = {
      header: [],
      sidebar: [],
      inContent: [],
      footer: [],
      mobile: [],
      gameCompletion: []
    };
    
    this.userPreferences = {
      showFallbackContent: true,
      allowDonationPrompts: true,
      allowSocialSharing: true
    };
    
    this.currentPage = '';
    this.adBlocked = false; // Always allow ads to show
    this.lastDonationPrompt = 0;
    this.donationPromptCooldown = 24 * 60 * 60 * 1000; // 24 hours
    
    this.loadAdHistory();
  }

  // Load ad history from localStorage
  loadAdHistory() {
    try {
      const saved = localStorage.getItem('adHistory');
      if (saved) {
        this.adHistory = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading ad history:', error);
    }
  }

  // Save ad history to localStorage
  saveAdHistory() {
    try {
      localStorage.setItem('adHistory', JSON.stringify(this.adHistory));
    } catch (error) {
      console.error('Error saving ad history:', error);
    }
  }

  // Mark that an ad was shown
  markAdShown(adType, adSlot) {
    const now = Date.now();
    this.adHistory[adType] = this.adHistory[adType] || [];
    this.adHistory[adType].push(now);
    
    // Keep only last 24 hours of history
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    this.adHistory[adType] = this.adHistory[adType].filter(timestamp => timestamp > oneDayAgo);
    
    this.saveAdHistory();
  }

  // Check if we should show an ad based on frequency limits
  shouldShowAd(adType) {
    // Always allow ads to show
    return true;
    
    const now = Date.now();
    const history = this.adHistory[adType] || [];
    const limits = this.adFrequency[adType];
    
    if (!limits) return true;
    
    // Check daily limit
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const dailyCount = history.filter(timestamp => timestamp > oneDayAgo).length;
    if (dailyCount >= limits.daily) return false;
    
    // Check hourly limit
    const oneHourAgo = now - (60 * 60 * 1000);
    const hourlyCount = history.filter(timestamp => timestamp > oneHourAgo).length;
    if (hourlyCount >= limits.hourly) return false;
    
    return true;
  }

  // Track ad impression
  trackAdImpression(adType) {
    console.log(`Ad impression tracked: ${adType}`);
    // Here you could send analytics data
  }

  // Track ad click
  trackAdClick(adType) {
    console.log(`Ad click tracked: ${adType}`);
    // Here you could send analytics data
  }

  // Track fallback interaction
  trackFallbackInteraction(adType, action) {
    console.log(`Fallback interaction tracked: ${adType} - ${action}`);
    // Here you could send analytics data
  }

  // Get fallback content for when ads are blocked
  getFallbackContent(adType) {
    const fallbackContent = {
      header: {
        title: "Support Our Games",
        message: "Consider disabling your ad blocker to support free game development",
        cta: "Learn More",
        icon: "❤️"
      },
      inContent: {
        title: "Enjoying the Games?",
        message: "Help us keep these games free by allowing ads or making a donation",
        cta: "Support Us",
        icon: "☕"
      },
      footer: {
        title: "Thank You for Playing",
        message: "Your support helps us create more educational games",
        cta: "Share with Friends",
        icon: "🌟"
      },
      gameCompletion: {
        title: "Great Job!",
        message: "You've completed the game! Consider supporting us to keep games free",
        cta: "Play Again",
        icon: "🏆"
      }
    };
    
    return fallbackContent[adType] || fallbackContent.inContent;
  }

  // Check if we should show donation prompt
  shouldShowDonationPrompt() {
    const now = Date.now();
    if (now - this.lastDonationPrompt < this.donationPromptCooldown) {
      return false;
    }
    
    // Show donation prompt if user has been active for a while
    const totalAdViews = Object.values(this.adHistory).reduce((sum, history) => sum + history.length, 0);
    return totalAdViews > 10; // Show after 10 ad views
  }

  // Show donation prompt
  showDonationPrompt() {
    this.lastDonationPrompt = Date.now();
    // Example: window.open('https://your-donation-page.com', '_blank');
  }

  // Get current page
  getCurrentPage() {
    return this.currentPage;
  }

  // Set current page
  setCurrentPage(page) {
    this.currentPage = page;
  }

  // Get ad blocker status (always false now)
  isAdBlockerActive() {
    return false;
  }
}

// Create and export singleton instance
const monetizationManager = new MonetizationManager();
export default monetizationManager; 