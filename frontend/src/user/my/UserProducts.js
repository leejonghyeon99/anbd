import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
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
                const url = `${apiUrl}/api/user/product-status?`;
    
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
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th style={{ width: '6%', textAlign: 'center' }}>번호</th>
                    <th>제목</th>                    
                    <th>가격</th>
                    <th>상태</th>
                    <th>작성일</th>
                    <th>끌어올린날</th>
                    <th>카테고리</th>
                    <th>조회수</th>
                    </tr>
                </thead>
                <tbody>
                    {productList.map(product => (
                    <tr className={`${styles.productList}`}
                        key={product.id}
                        onClick={()=> navigate(`/product/detail/${product.id}`)}
                    >
                        <td style={{ textAlign: 'center' }}>{product.id}</td>
                        <td>{product.title}</td>
                        <td>{formatKrw(product.price)}</td>
                        <td>{product.status}</td>
                        <td>{formatDateTime(product.createdAt)}</td>
                        <td>{formatDateTime(product.refreshedAt)}</td>
                        <td>{product.category.main} - {product.category.sub}</td>
                        <td>{product.viewCnt}</td>
                    </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

export default UserProducts;