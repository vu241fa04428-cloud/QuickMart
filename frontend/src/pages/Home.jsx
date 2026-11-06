import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Truck, ShieldCheck, BookOpen } from "lucide-react";
import api from "../api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/products", { params: { search, category: category || params.get("category") || "" } });
      setProducts(data);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }
  useEffect(() => { setCategory(params.get("category") || ""); }, [params]);
  useEffect(() => { load(); }, [search, category]);

  return <main>
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow">YOUR CAMPUS ESSENTIALS, DELIVERED</span><h1>Everything you need to <em>learn better.</em></h1><p>Discover books, notebooks and everyday stationery at prices students love.</p><a className="primary-btn" href="#catalogue">Explore collection</a></div>
      <div className="hero-art"><div className="hero-circle"><BookOpen size={100}/><span>Learn.<br/>Create.<br/>Grow.</span></div></div>
    </section>
    <section className="benefits">
      <div><Truck/><span><b>Easy delivery</b><small>Convenient doorstep delivery</small></span></div>
      <div><ShieldCheck/><span><b>Secure shopping</b><small>Your account is protected</small></span></div>
      <div><BookOpen/><span><b>Study essentials</b><small>Books and stationery together</small></span></div>
    </section>
    <section id="catalogue" className="catalogue">
      <div className="section-heading"><div><span className="eyebrow">THE QUICKMART COLLECTION</span><h2>Shop your essentials</h2></div><div className="search-box"><Search size={18}/><input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}/></div></div>
      <div className="filters"><button className={!category ? "active" : ""} onClick={() => setCategory("")}>All items</button><button className={category === "Books" ? "active" : ""} onClick={() => setCategory("Books")}>Books</button><button className={category === "Stationery" ? "active" : ""} onClick={() => setCategory("Stationery")}>Stationery</button></div>
      {loading ? <p>Loading products...</p> : products.length ? <div className="product-grid">{products.map(p => <ProductCard key={p._id} product={p}/>)}</div> : <div className="empty-state"><h3>No products found</h3><p>Try another search or category.</p></div>}
    </section>
  </main>;
}
