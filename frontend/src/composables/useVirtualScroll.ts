import { ref, computed, onMounted, onBeforeUnmount, type Ref } from 'vue'

export interface VirtualScrollOptions {
  totalItems: Ref<number> | number
  itemHeight: number
  overscan?: number
}

export function useVirtualScroll(options: VirtualScrollOptions) {
  const { itemHeight, overscan = 5 } = options

  const containerRef = ref<HTMLElement>()
  const scrollTop = ref(0)
  const containerHeight = ref(400)

  const totalItems = computed(() =>
    typeof options.totalItems === 'number' ? options.totalItems : options.totalItems.value
  )

  const totalHeight = computed(() => totalItems.value * itemHeight)

  const startIndex = computed(() =>
    Math.max(0, Math.floor(scrollTop.value / itemHeight) - overscan)
  )

  const endIndex = computed(() =>
    Math.min(totalItems.value, Math.ceil((scrollTop.value + containerHeight.value) / itemHeight) + overscan)
  )

  const visibleCount = computed(() => endIndex.value - startIndex.value)

  const offsetY = computed(() => startIndex.value * itemHeight)

  const bottomSpacerHeight = computed(() =>
    Math.max(0, totalHeight.value - offsetY.value - visibleCount.value * itemHeight)
  )

  function onScroll() {
    if (containerRef.value) {
      scrollTop.value = containerRef.value.scrollTop
    }
  }

  function updateContainerHeight() {
    if (containerRef.value) {
      containerHeight.value = containerRef.value.clientHeight
    }
  }

  function scrollToIndex(index: number) {
    if (containerRef.value) {
      containerRef.value.scrollTop = index * itemHeight
    }
  }

  onMounted(() => {
    updateContainerHeight()
    window.addEventListener('resize', updateContainerHeight)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateContainerHeight)
  })

  return {
    containerRef,
    totalHeight,
    startIndex,
    endIndex,
    visibleCount,
    offsetY,
    bottomSpacerHeight,
    onScroll,
    scrollToIndex,
    updateContainerHeight,
  }
}
