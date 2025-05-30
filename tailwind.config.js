/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom-glow': `
          5px 17px 38px 0px #E6E6E61A,
          19px 66px 69px 0px #E6E6E617,
          44px 149px 93px 0px #E6E6E60D,
          78px 265px 111px 0px #E6E6E603,
          121px 414px 121px 0px #E6E6E600
        `,
      },
    },
  },
  plugins: [],
}
