// Токены дизайна


// Типы для значений токенов

// Типы для цветов
type Color = { [_key: string]: string }
type Colors = { [_key: string]: Color }

// Типы для размеров
type Size = "default" | "xs" | "sm" | "md" | "lg" | "xl"
type Record_Size_Number = Record<Size, number>
type Sizes = { [_key: string]: Record_Size_Number }

// Типы для шрифтов
type Font_Style = {
  family: string
  size: Record_Size_Number
  weight: Record_Size_Number
}
type Typography = { [_key: string]: Font_Style | string }


// Тип объекта токенов
type Tokens = {
  colors: Colors
  typography: Typography
  size: Sizes
}


// Объект токенов
export const TOKENS: Tokens = {
  colors: {
    gray: {
      "1": "#FFFFFF",
      "2": "#DFDFDF",
      "3": "#BFBFBF",
      "4": "#9F9F9F",
      "5": "#808080",
      "6": "#606060",
      "7": "#404040",
      "8": "#202020",
      "9": "#000000"
    },
    accent: {
      "1": "#F4E5FF",
      "2": "#E4BFFF",
      "3": "#CA80FF",
      "4": "#AF40FF",
      "5": "#9500FF",
      "6": "#7000BF",
      "7": "#4A0080",
      "8": "#250040",
      "9": "#0F001A"
    },
    error: {
      "1": "#FFE9E5",
      "2": "#FFC8BF",
      "3": "#FF9080",
      "4": "#FF5940",
      "5": "#FF2200",
      "6": "#BF1A00",
      "7": "#801100",
      "8": "#400900",
      "9": "#1A0300"
    },
    warning: {
      "1": "#FFFBE5",
      "2": "#FFF4BF",
      "3": "#FFEA80",
      "4": "#FFDF40",
      "5": "#FFD400",
      "6": "#BF9F00",
      "7": "#806A00",
      "8": "#403500",
      "9": "#1A1500"
    },
    success: {
      "1": "#EEFFE5",
      "2": "#D4FFBF",
      "3": "#AAFF80",
      "4": "#80FF40",
      "5": "#55FF00",
      "6": "#40BF00",
      "7": "#2B8000",
      "8": "#154000",
      "9": "#091A00"
    },
    info: {
      "1": "#E5EEFF",
      "2": "#BFD4FF",
      "3": "#80AAFF",
      "4": "#4080FF",
      "5": "#0055FF",
      "6": "#0040BF",
      "7": "#002B80",
      "8": "#001540",
      "9": "#00091A"
    }
  },
  typography: {
    heading: {
      family: "IBM Plex Sans Condensed",
      size: {
        default: 40,
        xs: 44,
        sm: 48,
        md: 56,
        lg: 60,
        xl: 64
      },
      weight: {
        default: 500,
        xs: 500,
        sm: 600,
        md: 600,
        lg: 700,
        xl: 700
      }
    },
    body: {
      family: "IBM Plex Sans",
      size: {
        default: 12,
        xs: 16,
        sm: 20,
        md: 28,
        lg: 32,
        xl: 36
      },
      weight: {
        default: 400,
        xs: 400,
        sm: 500,
        md: 500,
        lg: 600,
        xl: 600
      }
    },
    mono: "IBM Plex Mono"
  },
  size: {
    screen: {
      default: 390,
      xs: 576,
      sm: 768,
      md: 1024,
      lg: 1440,
      xl: 1920
    },
    screen_padding: {
      default: 8,
      xs: 16,
      sm: 32,
      md: 64,
      lg: 128,
      xl: 256
    }
  }
} as const satisfies Tokens;