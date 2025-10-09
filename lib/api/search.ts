export interface IndexSearchResult {
  id: string
  name: string
  symbol: string
  description?: string
  marketCap?: number
  price?: number
}

export async function searchIndexes(query: string): Promise<IndexSearchResult[]> {
  // TODO: 백엔드 팀에서 실제 API endpoint로 교체
  // const response = await fetch(`/api/search/indexes?q=${encodeURIComponent(query)}`)
  // return response.json()
  
  // Mock data - 백엔드 연동 전까지 사용
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockResults: IndexSearchResult[] = [
        { id: '1', name: 'DeFi Index', symbol: 'DEFI', marketCap: 1000000, price: 100 },
        { id: '2', name: 'AI Index', symbol: 'AI', marketCap: 2000000, price: 200 },
        { id: '3', name: 'Gaming Index', symbol: 'GAME', marketCap: 500000, price: 50 },
      ]
      
      const filtered = mockResults.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.symbol.toLowerCase().includes(query.toLowerCase())
      )
      
      resolve(filtered)
    }, 300)
  })
}
