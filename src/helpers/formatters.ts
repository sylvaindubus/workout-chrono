const addLeadingZero = (n: number) => String(n < 10 ? '0' + n : n)

const formatHours = (n: number) => addLeadingZero(Math.floor(n / 3600))

const formatMinutes = (n: number) => addLeadingZero(Math.floor(n / 60 % 60))

const formatSeconds = (n: number) => addLeadingZero(Math.floor(n % 60))

const formatCentiseconds = (n: number) => addLeadingZero(Math.floor(n * 100 % 100))

export {
  formatHours,
  formatMinutes,
  formatSeconds,
  formatCentiseconds
}
