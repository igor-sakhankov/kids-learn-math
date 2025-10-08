# Asset Specifications for Kids Learn Math

This document specifies all visual and audio assets needed for the MVP.

## Design Principles

- **Style**: Soviet educational aesthetic - warm, calming, illustrative
- **Colors**: Soft, non-overstimulating palette (see constants.js)
- **Character**: Friendly, approachable, encouraging
- **Format**: PNG for images, SVG where possible for scalability

## 1. Robot Logik Character

### Required States
1. **Greeting** - Robot waving
2. **Happy** - Smiling, thumbs up
3. **Thinking** - Hand on chin, thoughtful expression
4. **Encouraging** - Pointing forward, motivating gesture
5. **Celebrating** - Jumping, stars around

### Specifications
- **Size**: 512x512px base resolution
- **Export sizes**: @1x, @2x, @3x for React Native
- **File naming**: `robot_logik_greeting.png`, `robot_logik_happy.png`, etc.
- **Location**: `/src/assets/characters/`

### Design Notes
- Friendly robot with rounded features
- Warm color palette (blues, oranges, gentle metallics)
- Large, expressive eyes
- Simple geometric shapes
- Soviet illustration style reference

## 2. Visual Learning Objects

### Required Objects
1. **Apples** 🍎 - Red apples with green leaf
2. **Cubes** 🧊 - Colorful building blocks
3. **Teddy Bears** 🧸 - Soft brown teddy bears
4. **Birds** 🐦 - Small cute birds
5. **Flowers** 🌸 - Simple 5-petal flowers
6. **Stars** ⭐ - Five-pointed stars

### Specifications
- **Size**: 128x128px base
- **Export sizes**: @1x, @2x, @3x
- **File naming**: `object_apple.png`, `object_cube.png`, etc.
- **Location**: `/src/assets/objects/`

### Design Notes
- Consistent illustration style across all objects
- Clear silhouettes for easy recognition
- Suitable for children 6-10 years old
- Can be used individually or in groups

## 3. Tree of Reason (Progress Visualization)

### Required Stages
1. **Sapling** (0-10 leaves) - Small young tree
2. **Young Tree** (10-20 leaves) - Growing tree with branches
3. **Flowering Tree** (20+ leaves) - Full tree with flowers

### Additional Elements
- **Individual leaf** - For counting progress
- **Flower** - Milestone reward
- **Sparkle/Logic Spark** - Game completion reward

### Specifications
- **Size**: 512x512px base (tree), 64x64px (leaf/flower)
- **Export sizes**: @1x, @2x, @3x
- **File naming**: `tree_sapling.png`, `tree_young.png`, `tree_flowering.png`
- **Location**: `/src/assets/icons/`

### Design Notes
- Organic, natural look
- Warm greens and browns
- Growth should be visually apparent
- Fits Soviet educational illustration style

## 4. Background Scenes

### Required Backgrounds
1. **Number City** - Urban scene with numbers integrated
2. **Logic Park** - Park/nature scene
3. **Generic Learning Space** - Neutral, warm background

### Specifications
- **Size**: 1920x1080px (landscape)
- **Export sizes**: Multiple resolutions for performance
- **File naming**: `bg_number_city.jpg`, `bg_logic_park.jpg`
- **Location**: `/src/assets/backgrounds/`

### Design Notes
- Soft focus, not distracting
- Warm color palette
- Safe for overlay text
- Can reuse existing professor-corgi.jpeg as placeholder

## 5. UI Elements

### Required Elements
1. **Buttons** - Primary, secondary, outline variants
2. **Cards** - Content containers
3. **Progress bars** - Visual feedback
4. **Achievement badges** - Various achievement types

### Specifications
- **Size**: Varies by element
- **Format**: SVG preferred for scalability
- **File naming**: `ui_button_primary.svg`, etc.
- **Location**: `/src/assets/icons/`

### Design Notes
- Can be implemented in code (StyleSheet) initially
- Custom graphics for badges and special elements
- Consistent with overall design system

## 6. Achievement Badges

### Required Badges
1. **First Logical Step** - Footprint icon
2. **Pattern Seeker** - Magnifying glass with pattern
3. **Mathematician Thinker** - Brain with numbers
4. **Persistence** - Mountain with flag

### Specifications
- **Size**: 256x256px base
- **Export sizes**: @1x, @2x, @3x
- **File naming**: `badge_first_step.png`, etc.
- **Location**: `/src/assets/icons/`

### Design Notes
- Gold/bronze color scheme for achievement feel
- Clear, simple iconography
- Celebratory but not overwhelming

## 7. Audio Assets (Future Phase)

### Required Sounds
1. **Voice recordings** (3 languages: EN, RU, ES)
   - Encouraging phrases
   - Number pronunciations
   - Instructions
2. **Sound effects**
   - Correct answer chime
   - Incorrect answer (gentle)
   - Button tap
   - Achievement unlock
   - Leaf/spark collection
3. **Background music** (optional)
   - Calm, instrumental
   - Loop-able
   - Volume adjustable

### Specifications
- **Format**: MP3 or AAC for compatibility
- **File naming**: `voice_en_correct.mp3`, `sfx_button_tap.mp3`
- **Location**: `/src/assets/sounds/`

### Design Notes
- Calm, warm voice tone
- Non-startling sound effects
- Music should be subtle, ignorable

## Asset Creation Workflow

### Phase 1: MVP Placeholders (Current)
- Use emoji as temporary visual objects ✓
- Use existing professor-corgi.jpeg background ✓
- Text-based UI elements ✓

### Phase 2: Core Assets
Priority order:
1. Robot Logik character (5 states)
2. Visual learning objects (6 types)
3. Tree of Reason (3 stages + elements)
4. Achievement badges (4 types)

### Phase 3: Polish Assets
1. Custom backgrounds (2-3 scenes)
2. Additional UI elements
3. Animations/transitions

### Phase 4: Audio Assets
1. Voice recordings
2. Sound effects
3. Background music

## File Organization

```
/src/assets/
├── characters/
│   ├── robot_logik_greeting@2x.png
│   ├── robot_logik_happy@2x.png
│   ├── robot_logik_thinking@2x.png
│   ├── robot_logik_encouraging@2x.png
│   └── robot_logik_celebrating@2x.png
├── objects/
│   ├── object_apple@2x.png
│   ├── object_cube@2x.png
│   ├── object_bear@2x.png
│   ├── object_bird@2x.png
│   ├── object_flower@2x.png
│   └── object_star@2x.png
├── backgrounds/
│   ├── bg_number_city.jpg
│   └── bg_logic_park.jpg
├── icons/
│   ├── tree_sapling@2x.png
│   ├── tree_young@2x.png
│   ├── tree_flowering@2x.png
│   ├── leaf@2x.png
│   ├── flower@2x.png
│   ├── spark@2x.png
│   ├── badge_first_step@2x.png
│   ├── badge_pattern_seeker@2x.png
│   ├── badge_mathematician@2x.png
│   └── badge_persistent@2x.png
└── sounds/
    ├── voice/
    │   ├── en/...
    │   ├── ru/...
    │   └── es/...
    ├── sfx/...
    └── music/...
```

## Tools & Resources

### Recommended Tools
- **Illustration**: Adobe Illustrator, Procreate, Affinity Designer
- **Image Editing**: Photoshop, GIMP
- **Vector Graphics**: Inkscape (free)
- **Audio**: Audacity (free), Adobe Audition

### Style References
- Soviet children's book illustrations (1960s-1980s)
- Modern educational apps with warm aesthetics
- Montessori-inspired visual materials

### Color Palette (from constants.js)
- Sky Blue: #AEE1F9
- Grass Green: #8FD68D
- Path Orange: #F8B133
- Text Dark: #2F2F2F
- Success Green: #4CAF50
- Error Red: #F44336
- Light Blue: #E3F2FD
- Soft Purple: #E1BEE7
- Warm Yellow: #FFF9C4
- Mint: #B2DFDB

## Notes for Designers

1. **Target Audience**: Children 6-10 years old
2. **Educational Context**: Math learning, logical thinking
3. **Emotional Tone**: Encouraging, patient, warm
4. **Cultural Context**: Inspired by Soviet pedagogical methods
5. **Accessibility**: High contrast options, clear shapes
6. **Scalability**: Assets should work across device sizes

## Budget & Timeline Considerations

- **MVP**: Can launch with emoji/placeholder graphics
- **Phase 2**: Core assets for first major release
- **Phase 3-4**: Polish and audio can be added incrementally

Estimated asset creation time: 40-60 hours for complete MVP asset package.

