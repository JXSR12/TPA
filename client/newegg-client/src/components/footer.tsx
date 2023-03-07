import React from 'react';
import styles from '@/styles/Footer.module.scss';

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.section}>
        <h4 className={styles.title}>CUSTOMER SERVICE</h4>
        <br/>
        <div className={styles.sectioncontent}>
          <a
            className={styles.linkcontainer}
            href="https://kb.newegg.com/"
          >
            Help Center
          </a>
          <a
            className={styles.linkcontainer}
            href="https://secure.newegg.com/orders/list"
          >
            Track an Order
          </a>
          <a
            className={styles.linkcontainer}
            href="https://secure.newegg.com/orders/list"
          >
            Return an Item
          </a>
          <a
            className={styles.linkcontainer}
            href="https://www.newegg.com/promotions/nepro/22-0073/index.html?cm_sp=cs_menu-_-return_policy"
          >
            Return policy
          </a>
          <a
            className={styles.linkcontainer}
            href="https://kb.newegg.com/Article/Index/12/3?id=1166"
          >
            Privacy & Security
          </a>
          <a
            className={styles.linkcontainer}
            href=""
          >
            Feedback
          </a>
        </div>
      </div>
      <div className={styles.section}>
        <h4 className={styles.title}>MY ACCOUNT</h4>
        <br/>
        <div className={styles.sectioncontent}>
          <a
            className={styles.linkcontainer}
            href="/login"
          >
            Login / Register
          </a>

          <a
            className={styles.linkcontainer}
            href="/order"
          >
            Order History
          </a>

          <a
            className={styles.linkcontainer}
            href="/dashboard"
          >
            Wish Lists
          </a>
        </div>
      </div>
      <div className={styles.section}>
        <h4 className={styles.title}>COMPANY INFORMATION</h4>
        <br/>
        <div className={styles.sectioncontent}>
          <a
            className={styles.linkcontainer}
            href="https://www.newegg.com/corporate/about"
          >
            About Oldegg
          </a>
          <a
            className={styles.linkcontainer}
            href="https://www.newegg.com/corporate/homepage"
          >
            Investor Relations
          </a>
          <a
            className={styles.linkcontainer}
            href="https://www.newegg.com/d/Info/Awards"
          >
            Awards / Rankings
          </a>
          <a
            className={styles.linkcontainer}
            href="https://www.newegg.com/d/Info/OfficeHours"
          >
            Hours and Locations
          </a>
        </div>
      </div>
      <div className={styles.section}>
        <h4 className={styles.title}>TOOLS & RESOURCES</h4>
        <br/>
        <div className={styles.sectioncontent}>
          <a
            className={styles.linkcontainer}
            href="https://www.newegg.com/sellers/?cm_sp=sell_on_newegg_footer"
          >
            Sell on Oldegg
          </a>
          <a
            className={styles.linkcontainer}
            href="https://www.neweggbusiness.com/why-business-account?cm_sp=for_your_business_footer"
          >
            For Your Business
          </a>
          <a
            className={styles.linkcontainer}
            href="https://partner.newegg.com/?cm_sp=newegg_partner_services_footer"
          >
            Oldegg Partner Services
          </a>
          <a
            className={styles.linkcontainer}
            href="https://www.newegg.com/creators?cm_sp=Homepage-bottom-_-creators"
          >
            Oldegg Creators
          </a>
        </div>
      </div>
      <div className={styles.section}>
        <h4 className={styles.title}>SHOP OUR BRANDS</h4>
        <br/>
        <div className={styles.sectioncontent}>
          <a
            className={styles.linkcontainer}
            href="https://www.neweggbusiness.com/"
          >
            Oldegg Business
          </a>
          <a
            className={styles.linkcontainer}
            href="https://promotions.newegg.com/international/global/index.html"
          >
            Oldegg Global
          </a>
          <a
            className={styles.linkcontainer}
            href="https://www.abs.com/?_gl=1*7cpnmx*_ga*NzQwNDQyMDU3LjE2NzYzNzQ4MzM.*_ga_TR46GG8HLR*MTY3ODAxNjcwNC4xNy4xLjE2NzgwMTY3OTMuMzIuMC4w*_fplc*aTV5NlJoUEVEVHZLRU9ra3liZHhqJTJGaTI5WnBPN0FmWkZSRU1SbnlrWWkyQllBOEZ1VDk0Z1JFY041akZ4JTJGcVpaOTZnUGw1JTJCaXVFV3BVWk9kJTJCMmdlT084aFVMemUwaEpnVWdJOTExMVR6WUR1WkdIR05RcXg0bFVJNmZMMmclM0QlM0Q."
          >
            ABS
          </a>
          <a
            className={styles.linkcontainer}
            href="https://www.rosewill.com/?_gl=1*jbu5wn*_ga*NzQwNDQyMDU3LjE2NzYzNzQ4MzM.*_ga_TR46GG8HLR*MTY3ODAxNjcwNC4xNy4xLjE2NzgwMTY3OTMuMzIuMC4w*_fplc*aTV5NlJoUEVEVHZLRU9ra3liZHhqJTJGaTI5WnBPN0FmWkZSRU1SbnlrWWkyQllBOEZ1VDk0Z1JFY041akZ4JTJGcVpaOTZnUGw1JTJCaXVFV3BVWk9kJTJCMmdlT084aFVMemUwaEpnVWdJOTExMVR6WUR1WkdIR05RcXg0bFVJNmZMMmclM0QlM0Q."
          >
            Rosewill
          </a>
        </div>
      </div>
    </div>
  );
}
