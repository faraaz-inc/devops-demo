
export type InRequest = {
    coin?: "bitcoin" | "ethereum" | "matic-network"
}

export interface StatsResponse {
    price: number,
    marketCap: number,
    "24hChange": number
}

export interface DeviationResponse {
    deviation: number
}