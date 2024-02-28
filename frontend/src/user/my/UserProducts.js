import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from './css/UserProducts.module.css'
const UserProducts = () => {

    const apiUrl = process.env.REACT_APP_API_BASE_URL;
    const token = 'Bearer ' + localStorage.getItem('accessToken');

    const navigate = useNavigate();

    const [page, setPage] = useState({
        pageNumber : 0,
        pageSize : 0,
    });

    const [productList, setProductList] = useState([]);

    //시간 포맷팅
    const formatDateTime = (dateTime) => {
        return moment(dateTime).format('YYYY년MM월DD일 HH:mm:ss');
      };

    const formatKrw = (amount) => {
     // 한국 원화로 포맷팅하는 Intl.NumberFormat 객체 생성
        const formatter = new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
        });

        
        return formatter.format(amount);
    };  


    
    useEffect(()=>{

        //판매중, 판매완료, 예약중 상품 목록
        const getProductStatus = async () => {
            try {
                const url = `${apiUrl}/api/user/product-status`;
    
                const option = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' : token
                    },
                };
    
                const response = await fetch(url,option);                    
                if(response.status === 200){
                    const data = await response.json();
                    console.log(data);
                    setProductList(data.content);
                    setPage({
                        pageNumber : data.pageable.pageNumber,
                        pageSize : data.pageable.pageSize,
                    })
                }
                                

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        getProductStatus();
    },[]);

    useEffect(()=>{console.log(productList);},[productList])
    return (
        <>
                        
            {productList.map(product => (
            <div className={`${styles.productCard}`} key={product.id} onClick={() => navigate(`/product/detail/${product.id}`)}>
                <img  
                    src={`${apiUrl}/upload/product/${product.fileList[0].photoName}`} 
                    className={`${styles.thumbnail}`}
                />
                <div>
                <div>{product.title}</div>
                <div>
                    <strong>번호:</strong> {product.id}<br />
                    <strong>가격:</strong> {formatKrw(product.price)}<br />
                    <strong>상태:</strong> {product.status}<br />
                    <strong>작성일:</strong> {formatDateTime(product.createdAt)}<br />
                    <strong>끌어올린날:</strong> {formatDateTime(product.refreshedAt)}<br />
                    <strong>카테고리:</strong> {product.category.main} - {product.category.sub}<br />
                    <strong>조회수:</strong> {product.viewCnt}<br />
                </div>
     
                </div>
            </div>
            ))}
        </>
    );
};

export default UserProducts;