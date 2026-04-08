"use client";
import { useEffect, useState } from "react";
import styles from "@/app/page.module.css";
import Header from "@/components/commons/Header";
import Sidebar from "@/components/commons/Sidebar";
import Main from "@/components/commons/Main";
import Footer from "@/components/commons/Footer";
import Alert from "@/components/ui/Alert";
import MainContainer from "@/components/home/MainContainer";
import Cart from "@/components/cart/Cart";
import Search from "@/components/others/Search";
import Head from "next/head";
import { metadata } from "./metadata";
import Wrapper from "@/components/commons/Wrapper";

export default function Home() {
  const [showCart, setShowCart] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    if (showCart) {
      document.body.classList.add(styles.open);
    } else {
      document.body.classList.remove(styles.open);
    }

    return () => {
      document.body.classList.remove(styles.open);
    };
  }, [showCart]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 767) {
        setShowSidebar(false);
        setMobile(true);
      } else {
        setShowSidebar(true);
        setMobile(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>

      <div className={styles.main}>
        <Header
          page="home"
          setShowCart={setShowCart}
          setShowSearchBar={setShowSearchBar}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />

        {showSearchBar && <Search setShowSearchBar={setShowSearchBar} />}
        <Wrapper>
          <Sidebar showSidebar={showSidebar} mobile={mobile} />
          <Main>
            <MainContainer showSidebar={showSidebar} />
          </Main>
        </Wrapper>
      </div>

      {showCart && <Cart setShowCart={setShowCart} />}

      <Footer />
      <Alert />
    </>
  );
}
