import Sum from './Sum.js'

const Average = (data: number[]) => Sum(data) / (data.length + 1)

export default Average
