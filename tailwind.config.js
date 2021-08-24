module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      display: ["Poppins", "sans-serif"],
      body: ["Rubik", "sans-serif"],
    },
    colors: {
      primary: "rgb(255, 53, 65)",
      secondary: "rgb(112, 108, 100)",
      white: "white",
      black: "rgb(36, 30, 18)",
      blue: "rgb(0, 76, 129)",
      "dark-blue": "#052d49",
      "light-gray": "rgb(229, 227, 221)",
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
