// "use client";

// import axios from "axios";
// import { useSession } from "next-auth/react";
// import { createContext, useContext, useEffect, useState } from "react";
// import { toast } from "sonner";

// interface CartItem {
//   _id: string;
//   oil: Oils;
//   quantity: number;
// }

// interface Review {
//   _id: string;
//   reviewer: string;
//   comment: string;
//   rating: number;
// }

// interface Benefit {
//   _id: string;
//   label: string;
//   benefit: string;
// }

// interface Use {
//   _id: string;
//   label: string;
//   usage: string;
// }

// interface Oils {
//   _id: string;
//   name: string;
//   price: number;
//   itemImage: string;
//   description: string;
//   reviews: Review[];
//   benefits: Benefit[];
//   use: Use[];
// }

// interface SearchContextType {
//   oil: Oils[];
//   refetchOils: () => void;
//   cart: CartItem[];
//   addToCart: (bookId: string, quantity: number) => Promise<void>;
//   removeFromCart: (itemId: string) => Promise<void>;
//   updateQuantity: (itemId: string, quantity: number) => Promise<void>;
// }

// export const SearchContext = createContext<SearchContextType | null>(null);

// const CheckContext = ({ children }: { children: React.ReactNode }) => {
//   const [oil, setOil] = useState<Oils[]>([]);
//   const [refetchTrigger, setRefetchTrigger] = useState(0);
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const { data: session } = useSession();

//   const fetchOils = async () => {
//     try {
//       const response = await axios.get("/api/oils");
//       if (response.status === 201) {
//         setOil(response.data.data);
//       } else {
//         toast.error("cannot fetch products");
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//    const fetchCart = async () => {
//     try {
//       const response = await axios.get("/api/cart", {
//         withCredentials: true,
//       });
//       setCart(response.data.data?.items ?? []);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const addToCart = async (oilId: string, quantity: number) => {
//     try {
//       await axios.post("/api/cart", { oilId, quantity }, {
//         withCredentials: true,
//       });
//       await fetchCart();
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const removeFromCart = async (cartId: string) => {
//     try {
//       await axios.delete(`/api/cart/${cartId}`, {
//         withCredentials: true,
//       });
//       await fetchCart();
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const updateQuantity = async (cartId: string, quantity: number) => {
//     try {
//       await axios.patch(`/api/cart/${cartId}`, { quantity }, {
//         withCredentials: true,
//       });
//       await fetchCart();
//     } catch (e) {
//       console.error(e);
//     }
//   };


//   useEffect(() => {
//     fetchOils();
//   }, [refetchTrigger]);

//   const refetchOils = () => setRefetchTrigger((prev) => prev + 1);

//    useEffect(() => {
//     if (session) {
//       fetchCart();
//     } else {
//       setCart([]); // clear cart on logout
//     }
//   }, [session]);



//   return (
//     <SearchContext.Provider
//       value={{
//         oil,
//         refetchOils,
//         cart,
//         updateQuantity,
//         addToCart,
//         removeFromCart,
//       }}
//     >
//       {children}
//     </SearchContext.Provider>
//   );
// };

// export const useOils = () => {
//   const context = useContext(SearchContext);
//   if (!context) throw new Error("useBooks must be used within a CheckContext");
//   return context;
// };

// export default CheckContext;


"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface CartItem {
  _id: string;
  oil: Oils;
  quantity: number;
}

interface Review {
  _id: string;
  reviewer: string;
  comment: string;
  rating: number;
}

interface Benefit {
  _id: string;
  label: string;
  benefit: string;
}

interface Use {
  _id: string;
  label: string;
  usage: string;
}

interface Oils {
  _id: string;
  name: string;
  price: number;
  itemImage: string;
  description: string;
  reviews: Review[];
  benefits: Benefit[];
  use: Use[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface SearchContextType {
  oil: Oils[];
  oilsLoading: boolean;
  pagination: Pagination;
  goToPage: (page: number) => void;
  updateSearch: (value: string) => void;
  refetchOils: () => void;
  cart: CartItem[];
  addToCart: (bookId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
}

export const SearchContext = createContext<SearchContextType | null>(null);

const PAGE_SIZE = 4;

const CheckContext = ({ children }: { children: React.ReactNode }) => {
  const [oil, setOil] = useState<Oils[]>([]);
  const [oilsLoading, setOilsLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const { data: session } = useSession();

  const fetchOils = async () => {
    try {
      setOilsLoading(true);
      const response = await axios.get("/api/oils", {
        params: { page, limit: PAGE_SIZE, search },
      });
      if (response.status === 201) {
        setOil(response.data.data);
        setPagination(response.data.pagination);
      } else {
        toast.error("cannot fetch products");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setOilsLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get("/api/cart", {
        withCredentials: true,
      });
      setCart(response.data.data?.items ?? []);
    } catch (e) {
      console.error(e);
    }
  };

  const addToCart = async (oilId: string, quantity: number) => {
    try {
      await axios.post("/api/cart", { oilId, quantity }, {
        withCredentials: true,
      });
      await fetchCart();
    } catch (e) {
      console.error(e);
    }
  };

  const removeFromCart = async (cartId: string) => {
    try {
      await axios.delete(`/api/cart/${cartId}`, {
        withCredentials: true,
      });
      await fetchCart();
    } catch (e) {
      console.error(e);
    }
  };

  const updateQuantity = async (cartId: string, quantity: number) => {
    try {
      await axios.patch(`/api/cart/${cartId}`, { quantity }, {
        withCredentials: true,
      });
      await fetchCart();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOils();
  }, [refetchTrigger, page, search]);

  const refetchOils = () => setRefetchTrigger((prev) => prev + 1);

  const goToPage = (p: number) => setPage(p);

  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(1); // reset to page 1 whenever the search term changes
  };

  useEffect(() => {
    if (session) {
      fetchCart();
    } else {
      setCart([]); // clear cart on logout
    }
  }, [session]);

  return (
    <SearchContext.Provider
      value={{
        oil,
        oilsLoading,
        pagination,
        goToPage,
        updateSearch,
        refetchOils,
        cart,
        updateQuantity,
        addToCart,
        removeFromCart,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useOils = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useBooks must be used within a CheckContext");
  return context;
};

export default CheckContext;