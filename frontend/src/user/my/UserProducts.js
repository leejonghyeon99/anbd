import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/UserProducts.module.css'
import SearchBox from './component/SearchBox';
import { Button } from 'react-bootstrap';
import CustomPagination from '../../components/CustomPagination';
const UserProducts = () => {

    const apiUrl = process.env.REACT_APP_API_BASE_URL;
    const token = 'Bearer ' + localStorage.getItem('accessToken');

    const navigate = useNavigate();

    const [page, setPage] = useState({
        pageNumber : 1,
        total: '',
    });

    const [productList, setProductList] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('전체');


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


    //판매중, 판매완료, 예약중 상품 목록
    const getProductStatus = async () => {
        
        try {
            const url = `${apiUrl}/api/user/product-status?page=${page.pageNumber}&status=${selectedStatus}`;

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
                    pageNumber: data.pageable.pageNumber+1,
                    total : data.totalPages
                })
            }
                            

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    




    const convertStatus = (status) => {
        switch (status){
            case 'SOLD': return '판매완료';
            case 'RESERVED': return '예약중';
            case 'SALE': return '판매중';
            default: return '';
        }
    }

    const statusOptions = [
        { value: '', label: '전체' },
        { value: 'SALE', label: '판매중' },
        { value: 'RESERVED', label: '예약중' },
        { value: 'SOLD', label: '판매완료' },
      ];


    
      const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setSelectedStatus(newStatus);
        setPage(prev => ({
            ...prev,
            pageNumber: 1,
        }));
    };
    
    const changePageNumber = (newPageNumber) => {
        setPage(prevPage => ({
            ...prevPage,
            pageNumber: newPageNumber,
        }));
    };
    
    useEffect(() => {
        getProductStatus();
    }, [selectedStatus, page.pageNumber]);
    
    return (
        <>
            <div className={`${styles.searchBox}`}>
                <SearchBox 
                    className={`${styles.searchComponent}`}
                    label="판매 상태로 검색"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    options={statusOptions}>                        
                </SearchBox>
            </div>            
            {productList.map(product => (
            <div className={`${styles.productCard}`} key={product.id} onClick={() => navigate(`/product/detail/${product.id}`)}>
                {product.fileList.length ? (
                    <img  
                        src={`${apiUrl}/upload/product/${product.fileList[0].photoName}`} 
                        className={`${styles.thumbnail}`}
                    />
                ) : (
                    <img  
                        src={`${apiUrl}/upload/product/default.png`} 
                        className={`${styles.thumbnail}`}
                    />
                )}
                <div className={`${styles.item}`}>
                        <div className={`${styles.titleAndView}`}><span>{product.title}</span> <span>조회수: {product.viewCnt}</span></div>
                        <span>가격: {formatKrw(product.price)}</span>
                        <span>상태: {convertStatus(product.status)}</span>
                        
                        
                        <span>카테고리: {product.category.main} - {product.category.sub}</span>
                        <span>작성일: {formatDateTime(product.createdAt)}</span>
                        <span>끌어올린날: {formatDateTime(product.refreshedAt)}</span>                      
                </div>
            </div>
            ))}
            <CustomPagination 
                currentPage={page.pageNumber} 
                totalPages={page.total} 
                onPageChange={changePageNumber}
            />
        </>
    );
};

export default UserProducts;