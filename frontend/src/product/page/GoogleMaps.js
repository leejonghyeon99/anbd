import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const GoogleMaps = ({setLocation}) => {
  const navigate = useNavigate();
  const {id} = useParams();
  const location = useLocation();
  const [selectedLocation, setSelectedLocation] = useState(""); // 선택된 좌표 상태변수 추가
  
  useEffect(() => {
    if (location.state && location.state.location) {
      const {lat, lng} = location.state.location;
      console.log("lat:", lat); // 확인용 콘솔 출력
      console.log("lng:", lng); // 확인용 콘솔 출력
      const newLocation = JSON.stringify({lat, lng}); //객체를 문자열로
      console.log("newLocation" + newLocation);
      setSelectedLocation(newLocation);
    }
  }, [location.state]);

  // 수정시 지도에서 수정페이지로 이동이 되지않음, 작성페이지로 이동됨
  const GoWrite = useCallback(() => {
    if (selectedLocation) {
      alert('위치 선택 완료');
      setLocation(selectedLocation); // 선택된 위치가 상태값에 설정됨
    } else {
      alert("위치를 선택해주세요!");
    }
  }, [selectedLocation, setLocation]);

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  
  const initMap = useCallback(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 37.49943, lng: 127.0359 }, // 학원좌표
      zoom: 19,
    });
    
    // 클릭이벤트리스너 추가
    map.addListener("click", (event) => {
      addMarker(event.latLng, map);
      const roundLat = parseFloat(event.latLng.lat()).toFixed(5);
      const roundLng = parseFloat(event.latLng.lng()).toFixed(5);
      setSelectedLocation({
        lat: roundLat,
        lng: roundLng,
      }); // 클릭한 좌표를 상태 변수에 설정
    });
  }, []);
  
  // 마커 추가
  const addMarker = (location, map) => {
    // 이전의 마커가 존재하는 경우 제거
    if(markerRef.current){
      markerRef.current.setMap(null);
    }
    const marker = new window.google.maps.Marker({
      position:location,
      map: map,
    });
    marker.addListener("click", () => {
      // 클릭한 좌표
      console.log(`lat:${marker.getPosition().lat()}, lng:${marker.getPosition().lng()}`);
    })
    // 새로운 마커를 참조에 할당
    markerRef.current = marker;
  }
  
  useEffect(() => {
    initMap();
  }, [initMap]);

  return (
    <div>
    <div
      className="map"
      style={{ width: "1000px", height: "750px" }}
      ref={mapRef}
    ></div>
      <Button variant="outline-dark mt-3" onClick={GoWrite}>선택 완료</Button>
    </div>
  );
}

export default GoogleMaps;