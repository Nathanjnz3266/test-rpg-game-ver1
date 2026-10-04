export class InputHandler {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.keys = {};
    this.mouse = {
      isLeftDown: false,
      isRightDown: false,
      dx: 0,
      dy: 0,
      scrollDelta: 0
    };
    this.isPointerLocked = false;
    this.onSkillPress = null;
    this.onInteractPress = null;
    this.onLockOnToggle = null;
    this.onMountToggle = null;
    this.onDodgePress = null;
    this.onAttackClick = null;
    this.onHeavyAttackClick = null;

    this.initListeners();
  }

  initListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      // Hotkeys trigger single press callbacks
      if (e.code === 'KeyE') {
        if (this.onInteractPress) this.onInteractPress();
      } else if (e.code === 'Tab') {
        e.preventDefault();
        if (this.onLockOnToggle) this.onLockOnToggle();
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (this.onDodgePress) this.onDodgePress();
      } else if (e.code === 'KeyV') {
        if (this.onMountToggle) this.onMountToggle();
      } else if (['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'KeyR', 'KeyQ'].includes(e.code)) {
        if (this.onSkillPress) this.onSkillPress(e.code);
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        this.mouse.isLeftDown = true;
        if (this.onAttackClick) this.onAttackClick();
      } else if (e.button === 2) {
        this.mouse.isRightDown = true;
        if (this.onHeavyAttackClick) this.onHeavyAttackClick();
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.mouse.isLeftDown = false;
      if (e.button === 2) this.mouse.isRightDown = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isPointerLocked || this.mouse.isRightDown || this.mouse.isLeftDown) {
        this.mouse.dx = e.movementX || 0;
        this.mouse.dy = e.movementY || 0;
      }
    });

    window.addEventListener('wheel', (e) => {
      this.mouse.scrollDelta = Math.sign(e.deltaY);
    }, { passive: true });

    // Prevent right click context menu on game canvas
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  isKeyDown(code) {
    return !!this.keys[code];
  }

  getMovementVector() {
    let x = 0;
    let z = 0;
    if (this.keys['KeyW'] || this.keys['ArrowUp']) z -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) z += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) x -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) x += 1;

    // Normalize length if diagonal
    const len = Math.hypot(x, z);
    if (len > 0) {
      x /= len;
      z /= len;
    }
    return { x, z };
  }

  resetMouseDelta() {
    this.mouse.dx = 0;
    this.mouse.dy = 0;
    this.mouse.scrollDelta = 0;
  }
}
