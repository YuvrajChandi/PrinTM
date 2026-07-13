/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0059bb",
          container: "#0070ea",
          fixed: "#d8e2ff",
          dim: "#adc7ff"
        },
        secondary: {
          DEFAULT: "#006b5f",
          container: "#6df5e1",
          fixed: "#71f8e4",
          dim: "#4fdbc8"
        },
        tertiary: {
          DEFAULT: "#9e3d00",
          container: "#c64f00",
          fixed: "#ffdbcc",
          dim: "#ffb695"
        },
        background: "#f7f9fb",
        surface: {
          DEFAULT: "#f7f9fb",
          dim: "#d8dadc",
          bright: "#f7f9fb",
          container: {
            lowest: "#ffffff",
            low: "#f2f4f6",
            DEFAULT: "#eceef0",
            high: "#e6e8ea",
            highest: "#e0e3e5",
          }
        },
        on: {
          surface: {
            DEFAULT: "#191c1e",
            variant: "#414754"
          },
          primary: {
            DEFAULT: "#ffffff",
            container: "#fefcff",
            fixed: "#001a41",
            variant: "#004493"
          },
          secondary: {
            DEFAULT: "#ffffff",
            container: "#006f64",
            fixed: "#00201c",
            variant: "#005048"
          },
          tertiary: {
            DEFAULT: "#ffffff",
            container: "#fffbff",
            fixed: "#351000",
            variant: "#7c2e00"
          },
          error: {
            DEFAULT: "#ffffff",
            container: "#93000a"
          }
        },
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6"
        },
        outline: {
          DEFAULT: "#717786",
          variant: "#c1c6d7"
        }
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px"
      },
      spacing: {
        md: "16px",
        base: "4px",
        xs: "4px",
        xl: "32px",
        gutter: "12px",
        sm: "8px",
        lg: "24px",
        "container-margin": "16px"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      }
    },
  },
  plugins: [],
}
