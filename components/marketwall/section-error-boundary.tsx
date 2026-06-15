"use client"

import { Component, type ReactNode } from "react"

type Props = {
  children: ReactNode
  name: string
}

type State = {
  hasError: boolean
}

/** Isolates sidebar/widget failures so the rest of the homepage keeps rendering. */
export class SectionErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    if (process.env.NODE_ENV === "development") {
      console.error(`[SectionErrorBoundary:${this.props.name}]`, error)
    }
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}
