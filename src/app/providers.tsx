'use client'

import { createContext, useState, useContext } from 'react'

type TaskStatus = 'Backlog' | 'To Do' | 'In Progress' | 'Done'

export type Task = {
  id: string
  title: string
  description: string
  dueDate: string
  status: TaskStatus
  credits: number
  dayOfWeek?: number // 0 (Sunday) to 6 (Saturday)
  goalId?: string
}

export type Goal = {
  id: string
  title: string
  description: string
  dueDate: string
  status: 'Not Started' | 'In Progress' | 'Completed'
  parentGoalId?: string
  tasks: Task[]
  credits: number
  period?: number // For quarterly (1-4), monthly (1-12), or weekly (1-52)
}

export type GoalContextType = {
  yearlyGoals: Goal[]
  quarterlyGoals: Goal[]
  monthlyGoals: Goal[]
  weeklyGoals: Goal[]
  addGoal: (goal: Goal, type: 'yearly' | 'quarterly' | 'monthly' | 'weekly') => void
  updateGoal: (goal: Goal, type: 'yearly' | 'quarterly' | 'monthly' | 'weekly') => void
  deleteGoal: (id: string, type: 'yearly' | 'quarterly' | 'monthly' | 'weekly') => void
  addTask: (task: Task, goalId: string, type: 'weekly') => void
  updateTask: (task: Task, goalId: string, type: 'weekly') => void
  deleteTask: (taskId: string, goalId: string, type: 'weekly') => void
}

const GoalContext = createContext<GoalContextType | undefined>(undefined)

export function Providers({ children }: { children: React.ReactNode }) {
  const [yearlyGoals, setYearlyGoals] = useState<Goal[]>([])
  const [quarterlyGoals, setQuarterlyGoals] = useState<Goal[]>([])
  const [monthlyGoals, setMonthlyGoals] = useState<Goal[]>([])
  const [weeklyGoals, setWeeklyGoals] = useState<Goal[]>([])

  const updateParentCredits = (goalId: string, creditDiff: number) => {
    const updateGoalCredits = (goals: Goal[], setGoals: React.Dispatch<React.SetStateAction<Goal[]>>) => {
      setGoals(prevGoals => 
        prevGoals.map(g => {
          if (g.id === goalId) {
            const updatedGoal = { ...g, credits: g.credits + creditDiff }
            if (g.parentGoalId) {
              updateParentCredits(g.parentGoalId, creditDiff)
            }
            return updatedGoal
          }
          return g
        })
      )
    }

    updateGoalCredits(weeklyGoals, setWeeklyGoals)
    updateGoalCredits(monthlyGoals, setMonthlyGoals)
    updateGoalCredits(quarterlyGoals, setQuarterlyGoals)
    updateGoalCredits(yearlyGoals, setYearlyGoals)
  }

  const addGoal = (goal: Goal, type: 'yearly' | 'quarterly' | 'monthly' | 'weekly') => {
    const newGoal = { ...goal, credits: 0 }
    switch (type) {
      case 'yearly':
        setYearlyGoals(prev => [...prev, newGoal])
        break
      case 'quarterly':
        setQuarterlyGoals(prev => [...prev, newGoal])
        break
      case 'monthly':
        setMonthlyGoals(prev => [...prev, newGoal])
        break
      case 'weekly':
        setWeeklyGoals(prev => [...prev, newGoal])
        break
    }
    if (newGoal.parentGoalId) {
      updateParentCredits(newGoal.parentGoalId, newGoal.credits)
    }
  }

  const updateGoal = (updatedGoal: Goal, type: 'yearly' | 'quarterly' | 'monthly' | 'weekly') => {
    const updateGoals = (goals: Goal[], setGoals: React.Dispatch<React.SetStateAction<Goal[]>>) => {
      setGoals(prevGoals => 
        prevGoals.map(g => g.id === updatedGoal.id ? updatedGoal : g)
      )
    }

    switch (type) {
      case 'yearly':
        updateGoals(yearlyGoals, setYearlyGoals)
        break
      case 'quarterly':
        updateGoals(quarterlyGoals, setQuarterlyGoals)
        break
      case 'monthly':
        updateGoals(monthlyGoals, setMonthlyGoals)
        break
      case 'weekly':
        updateGoals(weeklyGoals, setWeeklyGoals)
        break
    }

    if (updatedGoal.parentGoalId) {
      const oldGoal = (type === 'yearly' ? yearlyGoals : type === 'quarterly' ? quarterlyGoals : type === 'monthly' ? monthlyGoals : weeklyGoals).find(g => g.id === updatedGoal.id)
      if (oldGoal) {
        const creditDiff = updatedGoal.credits - oldGoal.credits
        updateParentCredits(updatedGoal.parentGoalId, creditDiff)
      }
    }
  }

  const deleteGoal = (id: string, type: 'yearly' | 'quarterly' | 'monthly' | 'weekly') => {
    const deleteFromGoals = (goals: Goal[], setGoals: React.Dispatch<React.SetStateAction<Goal[]>>) => {
      const goalToDelete = goals.find(g => g.id === id)
      if (goalToDelete && goalToDelete.parentGoalId) {
        updateParentCredits(goalToDelete.parentGoalId, -goalToDelete.credits)
      }
      setGoals(prevGoals => prevGoals.filter(g => g.id !== id))
    }

    switch (type) {
      case 'yearly':
        deleteFromGoals(yearlyGoals, setYearlyGoals)
        break
      case 'quarterly':
        deleteFromGoals(quarterlyGoals, setQuarterlyGoals)
        break
      case 'monthly':
        deleteFromGoals(monthlyGoals, setMonthlyGoals)
        break
      case 'weekly':
        deleteFromGoals(weeklyGoals, setWeeklyGoals)
        break
    }
  }

  const addTask = (task: Task, goalId: string, type: 'weekly') => {
    if (type === 'weekly') {
      setWeeklyGoals(prevGoals => 
        prevGoals.map(goal => {
          if (goal.id === goalId) {
            const updatedGoal = {
              ...goal,
              tasks: [...goal.tasks, { ...task, goalId: goal.id }],
              credits: goal.credits + task.credits
            }
            if (goal.parentGoalId) {
              updateParentCredits(goal.parentGoalId, task.credits)
            }
            return updatedGoal
          }
          return goal
        })
      )
    }
  }

  const updateTask = (updatedTask: Task, goalId: string, type: 'weekly') => {
    if (type === 'weekly') {
      setWeeklyGoals(prevGoals => 
        prevGoals.map(goal => {
          if (goal.id === goalId) {
            const oldTask = goal.tasks.find(t => t.id === updatedTask.id)
            const creditDiff = updatedTask.credits - (oldTask?.credits || 0)
            const updatedGoal = {
              ...goal,
              tasks: goal.tasks.map(t => t.id === updatedTask.id ? { ...updatedTask, goalId: goal.id } : t),
              credits: goal.credits + creditDiff
            }
            if (goal.parentGoalId) {
              updateParentCredits(goal.parentGoalId, creditDiff)
            }
            return updatedGoal
          }
          return goal
        })
      )
    }
  }

  const deleteTask = (taskId: string, goalId: string, type: 'weekly') => {
    if (type === 'weekly') {
      setWeeklyGoals(prevGoals => 
        prevGoals.map(goal => {
          if (goal.id === goalId) {
            const taskToDelete = goal.tasks.find(t => t.id === taskId)
            if (taskToDelete) {
              const updatedGoal = {
                ...goal,
                tasks: goal.tasks.filter(t => t.id !== taskId),
                credits: goal.credits - taskToDelete.credits
              }
              if (goal.parentGoalId) {
                updateParentCredits(goal.parentGoalId, -taskToDelete.credits)
              }
              return updatedGoal
            }
          }
          return goal
        })
      )
    }
  }

  return (
    <GoalContext.Provider value={{ 
      yearlyGoals, quarterlyGoals, monthlyGoals, weeklyGoals, 
      addGoal, updateGoal, deleteGoal, addTask, updateTask, deleteTask
    }}>
      {children}
    </GoalContext.Provider>
  )
}

export const useGoals = () => {
  const context = useContext(GoalContext)
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider')
  }
  return context
}

