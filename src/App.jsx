import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

export default function App() {
  const [products, setProducts] = useState([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')

  async function loadProducts() {
    const response = await fetch(`${API_BASE}/products`)
    if (!response.ok) throw new Error('API request failed')
    setProducts(await response.json())
  }

  useEffect(() => {
    loadProducts().catch(() => setMessage('Unable to connect to API'))
  }, [])

  async function addProduct(e) {
    e.preventDefault()
    setMessage('')

    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        price: Number(price)
      })
    })

    if (!response.ok) {
      setMessage('Failed to create product')
      return
    }

    setName('')
    setPrice('')
    setDescription('')
    setMessage('Product created successfully')
    await loadProducts()
  }

  async function deleteProduct(id) {
    await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' })
    await loadProducts()
  }

  return (
    <main className="container">
      <header>
        <h1>DevOps Demo Application</h1>
        <p>React + .NET 10 + PostgreSQL + Docker + GitHub Actions</p>
      </header>

      <section className="card">
        <h2>Add Product</h2>
        <form onSubmit={addProduct}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Product name" required />
          <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" type="number" min="0" step="0.01" required />
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
          <button type="submit">Add Product</button>
        </form>
        {message && <p className="message">{message}</p>}
      </section>

      <section className="card">
        <h2>Products</h2>
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Description</th><th>Price</th><th>Action</th></tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>₹{Number(product.price).toLocaleString()}</td>
                <td><button onClick={() => deleteProduct(product.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}
