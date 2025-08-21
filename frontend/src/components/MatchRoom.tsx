import React, { useState, useEffect, useRef, useCallback } from 'react'
import Editor from '@monaco-editor/react'

interface MatchRoomProps {
  onNavigateToLanding: () => void
  onMatchEnd: (result: 'win' | 'loss' | 'forfeit') => void
}

interface MatchState {
  timeRemaining: number
  isRunning: boolean
  problem: string
  difficulty: string
  opponent: string
}

const MatchRoom: React.FC<MatchRoomProps> = ({ onNavigateToLanding, onMatchEnd }) => {
  const [matchState, setMatchState] = useState<MatchState>({
    timeRemaining: 30 * 60, // 30 minutes in seconds
    isRunning: true,
    problem: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]

Constraints:
• 2 <= nums.length <= 104
• -109 <= nums[i] <= 109
• -109 <= target <= 109
• Only one valid answer exists.`,
    difficulty: 'Medium',
    opponent: 'AlgoWizard'
  })

  const [code, setCode] = useState(`function twoSum(nums, target) {
  // Your solution here
  // Return array of two indices that sum to target
  
}`)

  const [language, setLanguage] = useState('javascript')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isForfeiting, setIsForfeiting] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Boilerplate code for each language
  const getBoilerplateCode = (lang: string): string => {
    switch (lang) {
      case 'javascript':
        return `function twoSum(nums, target) {
  // Your solution here
  // Return array of two indices that sum to target
  
}`
      case 'python':
        return `def twoSum(nums, target):
    # Your solution here
    # Return array of two indices that sum to target
    
    pass`
      case 'java':
        return `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your solution here
        // Return array of two indices that sum to target
        
        return new int[]{};
    }
}`
      case 'cpp':
        return `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your solution here
        // Return array of two indices that sum to target
        
        return {};
    }
};`
      case 'csharp':
        return `public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        // Your solution here
        // Return array of two indices that sum to target
        
        return new int[]{};
    }
}`
      case 'go':
        return `func twoSum(nums []int, target int) []int {
    // Your solution here
    // Return array of two indices that sum to target
    
    return []int{}
}`
      default:
        return `function twoSum(nums, target) {
  // Your solution here
  // Return array of two indices that sum to target
  
}`
    }
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    setCode(getBoilerplateCode(newLanguage))
  }

  // Monaco Editor language mapping
  const getMonacoLanguage = (lang: string): string => {
    switch (lang) {
      case 'javascript': return 'javascript'
      case 'python': return 'python'
      case 'java': return 'java'
      case 'cpp': return 'cpp'
      case 'csharp': return 'csharp'
      case 'go': return 'go'
      default: return 'javascript'
    }
  }

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    // Simulate submission and evaluation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // For demo purposes, randomly determine win/loss
    const isWin = Math.random() > 0.5
    onMatchEnd(isWin ? 'win' : 'loss')
  }, [isSubmitting, onMatchEnd])

  const handleForfeit = () => {
    if (isForfeiting) return
    
    setIsForfeiting(true)
    
    // Simulate forfeit confirmation
    setTimeout(() => {
      onMatchEnd('forfeit')
    }, 1000)
  }

  const handleCodeChange = (value: string | undefined) => {
    if (value) {
      setCode(value)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#27ca3f'
      case 'Medium': return '#ffbd2e'
      case 'Hard': return '#ff6b6b'
      default: return '#a8b2d1'
    }
  }

  // Timer countdown
  useEffect(() => {
    if (matchState.isRunning && matchState.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setMatchState(prev => {
          if (prev.timeRemaining <= 1) {
            // Time's up - auto-submit
            handleSubmit()
            return { ...prev, timeRemaining: 0, isRunning: false }
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 }
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [matchState.isRunning, matchState.timeRemaining, handleSubmit])

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="match-room">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={onNavigateToLanding}>
            <span className="logo-text">
              <span className="leet">Leet</span>
              <span className="beef">Beef</span>
            </span>
          </div>
          
          <div className="nav-menu">
            <span className="match-info">
              vs. {matchState.opponent} • 
              <span 
                className="difficulty-badge"
                style={{ backgroundColor: getDifficultyColor(matchState.difficulty) }}
              >
                {matchState.difficulty}
              </span>
            </span>
          </div>
        </div>
      </nav>

      {/* Match Header */}
      <div className="match-header">
        <div className="match-timer">
          <div className="timer-label">Time Remaining</div>
          <div className={`timer-display ${matchState.timeRemaining <= 60 ? 'warning' : ''}`}>
            {formatTime(matchState.timeRemaining)}
          </div>
        </div>
        
        <div className="match-controls">
          <button 
            className="control-btn forfeit-btn"
            onClick={handleForfeit}
            disabled={isForfeiting}
          >
            {isForfeiting ? 'Forfeiting...' : 'Forfeit'}
          </button>
          
          <button 
            className="control-btn submit-btn"
            onClick={handleSubmit}
            disabled={isSubmitting || !matchState.isRunning}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Solution'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="match-content">
        {/* Problem Description */}
        <div className="problem-panel">
          <h2>Problem Description</h2>
          <div className="problem-content">
            <pre>{matchState.problem}</pre>
          </div>
        </div>

        {/* Code Editor */}
        <div className="editor-panel">
          <div className="editor-header">
            <h2>Your Solution</h2>
            <select 
              value={language} 
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="language-selector"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="csharp">C#</option>
              <option value="go">Go</option>
            </select>
          </div>
          
          <div className="editor-container">
            <Editor
              height="100%"
              defaultLanguage={getMonacoLanguage(language)}
              language={getMonacoLanguage(language)}
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                parameterHints: {
                  enabled: true
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Loading Overlay for Submit/Forfeit */}
      {(isSubmitting || isForfeiting) && (
        <div className="action-overlay">
          <div className="action-content">
            <div className="spinner"></div>
            <h3>{isSubmitting ? 'Submitting Solution...' : 'Forfeiting Match...'}</h3>
            <p>Please wait...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MatchRoom
