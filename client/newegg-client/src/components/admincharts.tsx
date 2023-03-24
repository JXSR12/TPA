import { GRAPHQL_API } from "@/utils/constants";
import axios from "axios";
import React from "react";
import { useSessionStorage } from "usehooks-ts";
import emailjs from '@emailjs/browser';
import Modal from "./modal";
import styles from '@/styles/Modal.module.css';
import textStyles from '@/styles/Login.module.css';
import utilStyles from '@/styles/Utils.module.css';
import actionStyles from '@/styles/Profile.module.scss';
import { Shop } from "@/interfaces/shop";
import { User } from "@/interfaces/user";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminCharts(props: {shops: Shop[], users: User[]}){
  const { shops, users } = props;
  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');
  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const [ data1, setData1 ] = React.useState<any>(null);
  const [ data2, setData2 ] = React.useState<any>(null);

  React.useEffect(() => {
    const data1 = {
      labels: [
        'Subscribed',
        'Not Subscribed',
      ],
      datasets: [{
        label: 'Users (%)',
        data: [users.filter((u) => {return u.mailing == true}).length / users.length * 100, users.filter((u) => {return u.mailing == false}).length / users.length * 100],
        backgroundColor: [
          'rgb(247, 139, 45)',
          'rgb(128, 123, 119)',
        ],
        hoverOffset: 30
      }]
    };

    setData1(data1);
  }, [users]);

  React.useEffect(() => {
    const data2 = {
      labels: shops.map(e => e.name).slice(0, 3),
      datasets: [{
        label: 'Total Transactional Value ($)',
        data: shops.map(e => e.transactionValue),
        backgroundColor: [
          'rgb(250, 122, 10)',
          'rgb(250, 146, 55)',
          'rgb(250, 181, 120)',
        ],
        hoverOffset: 50
      }]
    };

    setData2(data2);
  }, [shops]);

  return(
      <div>
        <center>
          <h2>Newsletter Interests</h2>
          <br/>
          {data1 && <Pie data={data1} />}
          <br/>
          <br/>
          <h2>Shop Transaction Value Shares</h2>
          <br/>
          {data2 && <Doughnut data={data2} />}
        </center>
      </div>
  )
}
