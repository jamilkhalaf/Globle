import React, { useState, useEffect } from 'react';
import countryInfo from './countryInfo';
import officialCountries from './officialCountries';
import Header from './Header';
import NotificationModal from './NotificationModal';
import AdPopup from './AdPopup';
import SmartAdComponent from './SmartAdComponent';
import { Box, useTheme, useMediaQuery } from '@mui/material';

const Capitals = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentCountry, setCurrentCountry] = useState('');
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [bestStreak, setBestStreak] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [showAdPopup, setShowAdPopup] = useState(false);

  // Add effect to show ad popup after intro closes
  useEffect(() => {
    if (!showIntro && !showAdPopup) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setShowAdPopup(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showIntro, showAdPopup]);

  // Get all available countries that have capital info
  const availableCountries = officialCountries.filter(country => 
    countryInfo[country] && countryInfo[country].capital
  );

  // Get all unique capitals for generating wrong options
  const allCapitals = Object.values(countryInfo)
    .map(country => country.capital)
    .filter(capital => capital && capital.trim() !== '');

  const updateGameStats = async (finalScore, gameTime, bestStreak) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('https://api.jamilweb.click/api/games/update-stats', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: 'capitals',
          score: finalScore,
          gameTime,
          bestStreak,
          attempts: 10 // Capitals has 10 questions
        }),
      });

      if (response.ok) {
        // Update badge progress
        await updateBadgeProgress(finalScore, gameTime, bestStreak);
      }
    } catch (error) {
      console.error('Error updating game stats:', error);
    }
  };

  const updateBadgeProgress = async (finalScore, gameTime, bestStreak) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('https://api.jamilweb.click/api/badges/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: 'capitals',
          score: finalScore,
          gameTime,
          bestStreak,
          attempts: 10 // Capitals has 10 questions
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.totalNewBadges > 0) {
          console.log(`🎉 Unlocked ${data.totalNewBadges} new badges!`);
        }
      }
    } catch (error) {
      console.error('Error updating badge progress:', error);
    }
  };

  const startGame = () => {
    setShowIntro(false);
    setGameStartTime(Date.now());
    generateQuestion();
  };

  const generateQuestion = () => {
    // Select a random country from available ones
    const randomCountry = availableCountries[Math.floor(Math.random() * availableCountries.length)];
    const correctCapital = countryInfo[randomCountry].capital;

    // Generate 3 wrong options
    const wrongCapitals = allCapitals
      .filter(capital => capital !== correctCapital)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Combine and shuffle all options
    const allOptions = [...wrongCapitals, correctCapital]
      .sort(() => Math.random() - 0.5);

    setCurrentCountry(randomCountry);
    setOptions(allOptions);
    setCorrectAnswer(correctCapital);
    setSelectedAnswer('');
    setIsCorrect(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (selectedCapital) => {
    if (showResult) return; // Prevent multiple selections

    setSelectedAnswer(selectedCapital);
    const correct = selectedCapital === correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore(prev => prev + 1);
      setBestStreak(prev => Math.max(prev, newStreak));
    } else {
      setStreak(0);
    }

    // Check if this is the 10th question before incrementing
    if (totalQuestions + 1 >= 10) {
      // This is the 10th question, don't increment, just end the game
      setTimeout(() => {
        setGameOver(true);
        // Update stats when game ends
        const gameTime = gameStartTime ? Math.round((Date.now() - gameStartTime) / 1000) : 0;
        updateGameStats(score + (correct ? 1 : 0), gameTime, bestStreak);
      }, 2000);
    } else {
      // Not the 10th question yet, increment and continue
      setTotalQuestions(prev => prev + 1);
      setTimeout(() => {
        generateQuestion();
      }, 2000);
    }
  };

  const resetGame = () => {
    setStreak(0);
    setScore(0);
    setTotalQuestions(0);
    setBestStreak(0);
    setGameOver(false);
    setShowIntro(true);
    setGameStartTime(null);
  };

  useEffect(() => {
    // Enable scrolling for mobile devices
    document.body.style.overflow = 'auto';
    
    // Clean up when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleIntroClose = () => {
    setShowIntro(false);
    generateQuestion();
  };

  const getOptionClass = (option) => {
    if (!showResult) return 'option';
    if (option === correctAnswer) return 'option correct';
    if (option === selectedAnswer && option !== correctAnswer) return 'option incorrect';
    return 'option';
  };

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '20px',
      paddingTop: '100px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      overflow: 'visible',
      WebkitOverflowScrolling: 'touch',
    },
    gameHeader: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    titleSection: {
      marginBottom: '30px',
    },
    gameTitle: {
      fontSize: '3.5rem',
      fontWeight: '800',
      background: 'linear-gradient(45deg, #43cea2, #185a9d)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '10px',
      textShadow: '0 0 30px rgba(67, 206, 162, 0.3)',
    },
    gameSubtitle: {
      fontSize: '1.2rem',
      color: '#a0a0a0',
      fontWeight: '300',
    },
    progressSection: {
      maxWidth: '400px',
      margin: '0 auto',
    },
    progressBar: {
      width: '100%',
      height: '8px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '10px',
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #43cea2, #185a9d)',
      borderRadius: '4px',
      transition: 'width 0.3s ease',
      width: `${((totalQuestions + 1) / 10) * 100}%`,
    },
    progressText: {
      color: '#a0a0a0',
      fontSize: '0.9rem',
      fontWeight: '500',
    },
    statsBar: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      marginBottom: '40px',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    statCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      padding: '25px 20px',
      textAlign: 'center',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    },
    statIcon: {
      fontSize: '2rem',
      marginBottom: '10px',
      display: 'block',
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: '800',
      color: '#43cea2',
      marginBottom: '5px',
      textShadow: '0 0 10px rgba(67, 206, 162, 0.3)',
    },
    statLabel: {
      fontSize: '0.8rem',
      color: '#a0a0a0',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '600',
    },
    questionSection: {
      marginBottom: '40px',
    },
    questionCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      padding: '30px',
      backdropFilter: 'blur(10px)',
      maxWidth: '600px',
      margin: '0 auto',
    },
    questionText: {
      fontSize: '1.8rem',
      color: 'white',
      textAlign: 'center',
      margin: '0',
      fontWeight: '600',
    },
    countryName: {
      color: '#43cea2',
      fontWeight: '800',
    },
    optionsSection: {
      marginBottom: '40px',
    },
    optionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
      maxWidth: '600px',
      margin: '0 auto',
    },
    option: {
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '15px',
      padding: '25px 20px',
      fontSize: '1.1rem',
      fontWeight: '600',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
      minHeight: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
    optionCorrect: {
      borderColor: '#43cea2',
      background: 'rgba(67, 206, 162, 0.2)',
      color: '#43cea2',
    },
    optionIncorrect: {
      borderColor: '#e74c3c',
      background: 'rgba(231, 76, 60, 0.2)',
      color: '#e74c3c',
    },
    correctIndicator: {
      position: 'absolute',
      top: '10px',
      right: '15px',
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
    incorrectIndicator: {
      position: 'absolute',
      top: '10px',
      right: '15px',
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
    resultMessage: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '15px',
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      backdropFilter: 'blur(10px)',
    },
    resultMessageCorrect: {
      borderColor: '#43cea2',
      background: 'rgba(67, 206, 162, 0.1)',
    },
    resultMessageIncorrect: {
      borderColor: '#e74c3c',
      background: 'rgba(231, 76, 60, 0.1)',
    },
    resultIcon: {
      fontSize: '1.5rem',
    },
    resultText: {
      color: 'white',
      fontSize: '1.1rem',
      fontWeight: '500',
    },
    gameOverScreen: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 80px)',
      padding: '20px',
    },
    gameOverContent: {
      textAlign: 'center',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '25px',
      padding: '50px 40px',
      backdropFilter: 'blur(20px)',
      maxWidth: '600px',
      width: '100%',
    },
    gameOverHeader: {
      marginBottom: '40px',
    },
    gameOverIcon: {
      fontSize: '4rem',
      marginBottom: '20px',
    },
    gameOverTitle: {
      fontSize: '2.5rem',
      color: '#43cea2',
      marginBottom: '15px',
      fontWeight: '800',
      background: 'linear-gradient(45deg, #43cea2, #185a9d)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    gameOverSubtitle: {
      fontSize: '1.1rem',
      color: '#a0a0a0',
      margin: '0',
      fontWeight: '400',
    },
    finalStatsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      marginBottom: '40px',
    },
    finalStatCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      padding: '25px 20px',
      textAlign: 'center',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    },
    finalStatIcon: {
      fontSize: '2rem',
      marginBottom: '10px',
      display: 'block',
    },
    finalStatNumber: {
      fontSize: '2.2rem',
      fontWeight: '800',
      color: '#43cea2',
      marginBottom: '8px',
      textShadow: '0 0 15px rgba(67, 206, 162, 0.4)',
    },
    finalStatLabel: {
      fontSize: '0.8rem',
      color: '#a0a0a0',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '600',
    },
    gameOverActions: {
      marginTop: '30px',
    },
    playAgainBtn: {
      position: 'relative',
      background: 'linear-gradient(45deg, #43cea2, #185a9d)',
      color: 'white',
      border: 'none',
      padding: '18px 40px',
      borderRadius: '50px',
      fontSize: '1.2rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      overflow: 'hidden',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      boxShadow: '0 5px 15px rgba(67, 206, 162, 0.3)',
    },
  };

  if (gameOver) {
    return (
      <>
        <Header />
        <div style={styles.container}>
          <div style={styles.gameOverScreen}>
            <div style={styles.gameOverContent}>
              <div style={styles.gameOverHeader}>
                <div style={styles.gameOverIcon}>🏆</div>
                <h1 style={styles.gameOverTitle}>Game Complete!</h1>
                <p style={styles.gameOverSubtitle}>Great job! Here's how you performed:</p>
              </div>
              
              <div style={styles.finalStatsGrid}>
                <div style={styles.finalStatCard}>
                  <div style={styles.finalStatIcon}>🎯</div>
                  <div style={styles.finalStatNumber}>{score}</div>
                  <div style={styles.finalStatLabel}>Final Score</div>
                </div>
                <div style={styles.finalStatCard}>
                  <div style={styles.finalStatIcon}>🔥</div>
                  <div style={styles.finalStatNumber}>{bestStreak}</div>
                  <div style={styles.finalStatLabel}>Best Streak</div>
                </div>
                <div style={styles.finalStatCard}>
                  <div style={styles.finalStatIcon}>📊</div>
                  <div style={styles.finalStatNumber}>{Math.round((score / 10) * 100)}%</div>
                  <div style={styles.finalStatLabel}>Accuracy</div>
                </div>
              </div>
              
              <div style={styles.gameOverActions}>
                <button onClick={resetGame} style={styles.playAgainBtn}>
                  Play Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <NotificationModal
        open={showIntro}
        onClose={() => {
          handleIntroClose();
          // setShowAdPopup(true); // This will be handled by useEffect
        }}
        title="How to Play Capitals"
        description="Test your knowledge of world capitals! You'll be shown a country name and 4 capital city options. Choose the correct capital to score points and build your streak. Complete 10 questions to finish the game. No time limit - take your time!"
        color="primary"
        buttonText="Start Game"
      />
      {/* AdPopup is now rendered in the main game view */}
      <div style={styles.container}>
        <div style={styles.gameHeader}>
          <div style={styles.titleSection}>
            <h1 style={styles.gameTitle}>🏛️ Capitals</h1>
            <p style={styles.gameSubtitle}>Test your knowledge of world capitals</p>
          </div>
          
          <div style={styles.progressSection}>
            <div style={styles.progressBar}>
              <div style={styles.progressFill}></div>
            </div>
            <div style={styles.progressText}>Question {totalQuestions + 1} of 10</div>
          </div>
        </div>

        <div style={styles.statsBar}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🎯</div>
            <div style={styles.statValue}>{score}</div>
            <div style={styles.statLabel}>Score</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🔥</div>
            <div style={styles.statValue}>{streak}</div>
            <div style={styles.statLabel}>Streak</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📊</div>
            <div style={styles.statValue}>{totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%</div>
            <div style={styles.statLabel}>Accuracy</div>
          </div>
        </div>

        <div style={styles.questionSection}>
          <div style={styles.questionCard}>
            <h2 style={styles.questionText}>
              What is the capital of <span style={styles.countryName}>{currentCountry}</span>?
            </h2>
          </div>
        </div>

        <div style={styles.optionsSection}>
          <div style={styles.optionsGrid}>
            {options.map((capital, index) => (
              <button
                key={index}
                style={{
                  ...styles.option,
                  ...(showResult && capital === correctAnswer ? styles.optionCorrect : {}),
                  ...(showResult && capital === selectedAnswer && capital !== correctAnswer ? styles.optionIncorrect : {})
                }}
                onClick={() => handleAnswerSelect(capital)}
                disabled={showResult}
              >
                <span>{capital}</span>
                {showResult && capital === correctAnswer && (
                  <div style={styles.correctIndicator}>✓</div>
                )}
                {showResult && capital === selectedAnswer && capital !== correctAnswer && (
                  <div style={styles.incorrectIndicator}>✗</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Sidebar Ads - Fixed on left and right sides */}
        {!isMobile && (
          <>
            {/* Left Sidebar Ad */}
            <Box
              sx={{
                position: 'fixed',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '160px',
                zIndex: 999
              }}
            >
              <SmartAdComponent
                adSlot="9833563267"
                adType="sidebar"
                adFormat="auto"
                responsive={true}
                style={{
                  width: '160px',
                  minHeight: '600px',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              />
            </Box>

            {/* Right Sidebar Ad */}
            <Box
              sx={{
                position: 'fixed',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '160px',
                zIndex: 999
              }}
            >
              <SmartAdComponent
                adSlot="5275872162"
                adType="sidebar"
                adFormat="auto"
                responsive={true}
                style={{
                  width: '160px',
                  minHeight: '600px',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              />
            </Box>
          </>
        )}

        {/* Ad Popup - Shows after notification modal closes */}
        <AdPopup
          open={showAdPopup}
          onClose={() => setShowAdPopup(false)}
          title="Support Us"
        />
      </div>
    </>
  );
};

export default Capitals; 