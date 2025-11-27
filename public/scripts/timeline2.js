(function () {
  const ACTIVE_DOT = 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.85)] scale-125 opacity-100';
  const INACTIVE_DOT =
    'bg-gray-400 shadow-[0_0_10px_rgba(255,255,255,0.5)] opacity-70';
  const ACTIVE_TEXT =
    'text-gray-300 text-lg transition-all duration-300';
  const INACTIVE_TEXT =
    'text-gray-400 text-base opacity-70 transition-all duration-300';

  window.timelineController = function () {
    return {
      activeIndex: 0,
      totalItems: 0,
      isLocked: false,
      hasCompleted: false,
      pendingStart: false,
      wheelHandler: null,
      scrollHandler: null,
      animating: false,
      sectionEl: null,
      init() {
        const items = this.$refs.timelineList?.querySelectorAll('[data-timeline-item]') ?? [];
        this.totalItems = items.length;
        this.sectionEl = this.$root;
        this.attachScrollListener();
      },
      onEnterSection() {
        if (this.hasCompleted) return;
        this.pendingStart = true;
        this.checkVisibilityAndStart();
      },
      onLeaveSection() {
        if (!this.hasCompleted) {
          this.pendingStart = false;
          this.cancelLock();
        }
      },
      attachScrollListener() {
        this.cleanupScroll();
        this.scrollHandler = () => {
          if (this.pendingStart) {
            this.checkVisibilityAndStart();
          }
        };
        window.addEventListener('scroll', this.scrollHandler, { passive: true });
      },
      checkVisibilityAndStart() {
        if (!this.pendingStart || this.isLocked || this.hasCompleted) return;
        const rect = this.sectionEl?.getBoundingClientRect();
        if (!rect) return;
        const fullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        if (fullyVisible) {
          this.pendingStart = false;
          this.startSequence();
        }
      },
      startSequence() {
        if (this.isLocked || this.totalItems === 0) return;
        this.isLocked = true;
        this.activeIndex = 0;
        this.attachWheel();
      },
      attachWheel() {
        this.cleanupWheel();
        this.wheelHandler = (event) => {
          if (!this.isLocked) return;
          event.preventDefault();
          if (this.animating) return;
          const direction = event.deltaY > 0 ? 1 : event.deltaY < 0 ? -1 : 0;
          if (direction === 0) return;
          this.animating = true;
          this.advance(direction);
        };
        window.addEventListener('wheel', this.wheelHandler, { passive: false });
      },
      advance(direction) {
        if (direction > 0) {
          if (this.activeIndex < this.totalItems - 1) {
            this.activeIndex++;
          } else {
            this.finishSequence();
            return;
          }
        } else {
          if (this.activeIndex > 0) {
            this.activeIndex--;
          } else {
            this.finishSequence();
            return;
          }
        }
        setTimeout(() => {
          this.animating = false;
        }, 300);
      },
      finishSequence() {
        this.cleanupWheel();
        this.isLocked = false;
        this.animating = false;
        this.hasCompleted = true;
        this.pendingStart = false;
        this.activeIndex = -1;
      },
      cancelLock() {
        this.cleanupWheel();
        this.isLocked = false;
        this.animating = false;
      },
      cleanupWheel() {
        if (this.wheelHandler) {
          window.removeEventListener('wheel', this.wheelHandler, { passive: false });
          this.wheelHandler = null;
        }
      },
      cleanupScroll() {
        if (this.scrollHandler) {
          window.removeEventListener('scroll', this.scrollHandler, { passive: true });
          this.scrollHandler = null;
        }
      },
      getDotClass(index) {
        return this.activeIndex === index ? ACTIVE_DOT : INACTIVE_DOT;
      },
      getTextClass(index) {
        return this.activeIndex === index ? ACTIVE_TEXT : INACTIVE_TEXT;
      },
      destroy() {
        this.cleanupWheel();
        this.cleanupScroll();
      },
    };
  };
})();
