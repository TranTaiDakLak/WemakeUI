export function useStagger(baseDelayMs = 60, maxItems = 16) {
  return (index: number): Record<string, string> => {
    const delay = Math.min(index, maxItems - 1) * baseDelayMs
    return {
      '--stagger-delay': `${delay}ms`,
      animationDelay: `${delay}ms`,
    }
  }
}
