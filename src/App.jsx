import { useState, useMemo, useEffect, useCallback } from "react";


// ── Hansy SVG Icons ──────────────────────────────────────────────
const IC = {
  dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  players:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="3"/><path d="M3 21v-2a5 5 0 0 1 5-5h2"/><circle cx="17" cy="11" r="3"/><path d="M14 21v-1a4 4 0 0 1 4-4h1a4 4 0 0 1 4 4v1"/></svg>,
  ranking:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 20v-8"/><path d="M12 20V4"/><path d="M18 20v-5"/><path d="M3 20h18"/></svg>,
  tournament:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M5 3H3v5c0 2.8 2 5 4.5 6"/><path d="M19 3h2v5c0 2.8-2 5-4.5 6"/><path d="M7 3h10v6a5 5 0 0 1-10 0V3z"/></svg>,
  roles:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  history:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-9 9"/><path d="M12 7v5l3 3"/><path d="M3 12H1"/></svg>,
  rules:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>,
  edit:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  stats:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  bolt:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  register:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>,
  refresh:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M20.5 15a9 9 0 1 1-2.7-7.3L23 10"/></svg>,
  lock:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  crown:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20"/><path d="M4 20 2 8l6 4 4-6 4 6 6-4-2 12"/></svg>,
  shield:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  trophy:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M5 3H3v5c0 2.8 2 5 4.5 6"/><path d="M19 3h2v5c0 2.8-2 5-4.5 6"/><path d="M7 3h10v6a5 5 0 0 1-10 0V3z"/></svg>,
  medal:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="15" r="5"/><path d="M8.5 8.5 7 3H17l-1.5 5.5"/><path d="M9 3 7.5 9.5"/><path d="M15 3l1.5 6.5"/></svg>,
  ping:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/></svg>,
  user:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  star:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  male:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="14" r="5"/><path d="M21 3l-6 6"/><path d="M15 3h6v6"/></svg>,
  female:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><line x1="12" y1="13" x2="12" y2="21"/><line x1="9" y1="18" x2="15" y2="18"/></svg>,
  ping2:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 1-9 9"/><path d="M3 12a9 9 0 0 1 9-9"/><path d="M12 17l2-5-5-2"/></svg>,
  calendar:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  settings:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  plus:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  check:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  location:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  mail:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  fb:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  target:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  notepad:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  tag:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  logOut:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  key:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
};

function Icon({n,size=18,color,style={}}) {
  return <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:size,height:size,flexShrink:0,color:color||"currentColor",...style}}>{IC[n]||null}</span>;
}

// ── Cover Image Reader ──────────────────────────────────────────
function readFileAsBase64(file){
  return new Promise((res,rej)=>{
    const r=new FileReader();
    r.onload=()=>res(r.result);
    r.onerror=rej;
    r.readAsDataURL(file);
  });
}

// ── Share Link Util ─────────────────────────────────────────────
function getTourShareUrl(tourId){
  const base = window.location.origin+window.location.pathname;
  return base+"?reg="+tourId;
}

const TIER_COLORS = {
  "1+":"#ec7a1c","1-":"#f4954a","2++":"#e6a53a","2+":"#d4b870",
  "2":"#44443b","2-":"#7a7a6e","3+":"#a09e95","3":"#c8c5be",
};
const TIER_BOOM = {
  "1+":2.8,"1-":2.75,"2++":2.7,"2+":2.65,"2":2.1,"2-":2.05,"3+":2.55,"3":2.5,
};
const TIERS = ["1+","1-","2++","2+","2","2-","3+","3"];
const ADMIN_CREDENTIALS = [
  {username:"admin",    password:"pickleboom@2026", label:"Administrator", role:"admin"},
  {username:"hahoang",  password:"mod@hahoang",     label:"Ha Hoang",      role:"mod"},
  {username:"viettan",  password:"mod@viettan",     label:"Viết Tân",      role:"mod"},
];

const ROLE_PERMISSIONS = {
  admin: {
    label:"Administrator",
    color:"#ec7a1c",
    badge:"crown",
    canEditPlayers: true,
    canDeletePlayers: true,
    canAddPlayers: true,
    canAdjustScore: true,
    canCreateTournament: true,
    canManageTournament: true,
    canApproveReg: true,
    canApproveTourReg: true,
    canResetData: true,
    canManageRoles: true,
  },
  mod: {
    label:"Moderator",
    color:"#f4954a",
    badge:"shield",
    canEditPlayers: true,
    canDeletePlayers: true,
    canAddPlayers: true,
    canAdjustScore: true,
    canCreateTournament: true,
    canManageTournament: true,
    canApproveReg: true,
    canApproveTourReg: true,
    canResetData: false,
    canManageRoles: false,
  },
};

const INIT = {
  male:[
    {id:1,name:"Huy Phạm ",tier:"1+",boom:2.83,remark:"Á quân pvna 5.2 Quảng Ngãi 8/3"},
    {id:2,name:"A Hòa ",tier:"1+",boom:2.83,remark:"+0.03 Á Quân WeekBoom1 21/01"},
    {id:3,name:"Phong ",tier:"1+",boom:2.85,remark:"+0.05 Vô địch WeekBoom2 31/01"},
    {id:4,name:"Tân Liver ",tier:"1-",boom:2.8,remark:"+0.05 Vô địch WeekBoom1 21/01"},
    {id:5,name:"Vũ Luân ",tier:"1-",boom:2.75},
    {id:6,name:"Viết Tân",tier:"1-",boom:2.75},
    {id:7,name:"Quảng Chế",tier:"2++",boom:2.73,remark:"Á Quân pvna fpt 8/3"},
    {id:8,name:"Hiếu Trần",tier:"2++",boom:2.7},
    {id:9,name:"Quí Nguyễn",tier:"2++",boom:2.7},
    {id:10,name:"Ha Hoang",tier:"2++",boom:2.7},
    {id:11,name:"Tiến Nguyễn",tier:"2+",boom:2.65},
    {id:12,name:"Dương Mỹ",tier:"2+",boom:2.65},
    {id:13,name:"A Dũng Newlife",tier:"2+",boom:2.65},
    {id:14,name:"Nghĩa",tier:"2+",boom:2.65},
    {id:15,name:"Minh Trần",tier:"2+",boom:2.68,remark:"+0.03 Á Quân WeekBoom2 31/01"},
    {id:16,name:"Tan Thuan",tier:"2+",boom:2.65},
    {id:17,name:"Hùng Cận",tier:"2+",boom:2.65},
    {id:18,name:"Rin",tier:"2+",boom:2.65},
    {id:19,name:"Bin BIn",tier:"2+",boom:2.65},
    {id:20,name:"Tư Khoa",tier:"2-",boom:2.63,remark:"+0.03 Á Quân WeekBoom2 31/01"},
    {id:21,name:"Tuấn Nguyên",tier:"2-",boom:2.6},
    {id:22,name:"An gs",tier:"2-",boom:2.6},
    {id:23,name:"Đình Chung",tier:"2-",boom:2.6},
    {id:24,name:"Mạnh Hoàng",tier:"2-",boom:2.6},
    {id:25,name:"Hưng",tier:"3+",boom:2.55},
    {id:26,name:"Quốc Đạt",tier:"3+",boom:2.55},
    {id:27,name:"Luân Ng",tier:"3+",boom:2.55},
    {id:28,name:"Huy PHan",tier:"3+",boom:2.55},
    {id:29,name:"A Toàn",tier:"3+",boom:2.55},
    {id:30,name:"Trần Anh Đức",tier:"3+",boom:2.58,remark:"+0.03 Vô địch giải nội bộ ngành du lịch 15/01"},
    {id:31,name:"Nhan Tam",tier:"3+",boom:2.55},
    {id:32,name:"Phúc",tier:"3",boom:2.5},
    {id:33,name:"Vĩnh",tier:"3",boom:2.5},
    {id:34,name:"Xưng",tier:"3",boom:2.5},
    {id:35,name:"WIN",tier:"3",boom:2.5},
    {id:36,name:"Huy Oto",tier:"3",boom:2.5},
    {id:37,name:"Tứ Linh",tier:"3",boom:2.5},
    {id:38,name:"Hùng AAC",tier:"3",boom:2.5},
    {id:39,name:"Linh Huỳnh",tier:"3",boom:2.5},
    {id:40,name:"Trương Hùng",tier:"3",boom:2.5},
    {id:41,name:"Tuấn Mai",tier:"3",boom:2.745,remark:"Tham gia mini game 21/01 . Snapshot 15/01"},
    {id:42,name:"Thanh Tuấn",tier:"3",boom:2.6,remark:"Mini game 21/01 . Snapshot 18/01 tickvang"},
    {id:43,name:"Duy Anh",tier:"3",boom:2.95},
  ],
  female:[
    {id:101,name:"Như Hiếu",tier:"1+",boom:2.15},
    {id:102,name:"Giao",tier:"1+",boom:2.19,remark:"+0.04 Vô địch WeekBoom2 31/01"},
    {id:103,name:"Hiếu tay trái",tier:"1+",boom:2.15},
    {id:104,name:"Phương Thảo",tier:"1+",boom:2.15},
    {id:105,name:"Nga",tier:"1+",boom:2.15},
    {id:106,name:"Linh Thái",tier:"1+",boom:2.15},
    {id:107,name:"Dương",tier:"2",boom:2.1},
    {id:108,name:"Diệu",tier:"2",boom:2.1},
    {id:109,name:"Phương Cici",tier:"2",boom:2.14,remark:"+0.04 Vô địch WeekBoom1 21/01"},
    {id:110,name:"Hải",tier:"2",boom:2.1},
    {id:111,name:"Hằng",tier:"2",boom:2.1},
    {id:112,name:"Mai",tier:"2",boom:2.1},
    {id:113,name:"Milo",tier:"2",boom:2.1},
    {id:114,name:"C Yến K",tier:"2",boom:2.1},
    {id:115,name:"Song Hà",tier:"2",boom:2.1},
    {id:116,name:"Vũ Thảo",tier:"2",boom:2.1},
    {id:117,name:"Hằng niu",tier:"2",boom:2.1},
    {id:118,name:"Tú",tier:"2",boom:2.1},
    {id:119,name:"Hương",tier:"2",boom:2.1},
    {id:120,name:"Ái",tier:"2-",boom:2.05},
    {id:121,name:"Thu Hà",tier:"2-",boom:2.05},
    {id:122,name:"Nguyên",tier:"2-",boom:2.05},
    {id:123,name:"C Bi",tier:"2-",boom:2.05},
    {id:124,name:"Thảo nhỏ",tier:"2-",boom:2.07,remark:"+0.02 Á Quân WeekBoom1 21/01"},
    {id:125,name:"Lam Bình",tier:"2-",boom:2.05},
    {id:126,name:"Anber",tier:"2-",boom:2.05},
    {id:127,name:"Trang Đỗ",tier:"2-",boom:2.05},
    {id:128,name:"Quỳnh Anh",tier:"2-",boom:2.05},
    {id:129,name:"Thùy Huỳnh",tier:"2",boom:2.1,remark:"Mini game 21/01 . Snapshot 18/01 tickvang"},
  ],
};

const C = {
  orange:"#ec7a1c",orange2:"#f4954a",bg:"#1e1e1a",bg2:"#28281f",bg3:"#333329",
  border:"rgba(236,122,28,0.22)",text:"#f0ede8",muted:"#a09e95",dim:"#44443b",
};

function TierChip({tier}){
  return <span style={{fontSize:10,padding:"2px 7px",borderRadius:20,fontWeight:800,border:"1px solid "+TIER_COLORS[tier]+"55",background:TIER_COLORS[tier]+"18",color:TIER_COLORS[tier],flexShrink:0}}>{tier}</span>;
}
function BoomBadge({boom,tier}){
  return <span style={{padding:"3px 10px",borderRadius:20,fontSize:13,fontWeight:800,color:TIER_COLORS[tier],background:TIER_COLORS[tier]+"1a",border:"1px solid "+TIER_COLORS[tier]+"33"}}>{boom.toFixed(2)}</span>;
}
function Card({children,style={}}){
  return <div style={{background:"rgba(68,68,59,0.18)",border:"1px solid "+C.border,borderLeft:"3px solid "+C.orange,borderRadius:8,padding:16,...style}}>{children}</div>;
}
function SectionTitle({children}){
  return <div style={{fontSize:13,fontWeight:700,color:C.orange,marginBottom:12,letterSpacing:0.5,textTransform:"uppercase"}}>{children}</div>;
}

const MS = {
  width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(236,122,28,0.25)",
  borderRadius:10,padding:"11px 14px",color:"#E5E7EB",fontSize:16,outline:"none",boxSizing:"border-box",
};

const SB_URL = "https://oevgauxkildxdrqnphnw.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ldmdhdXhraWxkeGRycW5waG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMzYzOTUsImV4cCI6MjA4ODcxMjM5NX0.SMw09iIB6-3kaEjzXrxF7tP8DsN375linNZPxX1B2kc";

const sbFetch = async (path, options={}) => {
  const {headers: optHeaders={}, ...restOptions} = options;
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    ...restOptions,
    headers: {
      "apikey": SB_KEY,
      "Authorization": `Bearer ${SB_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
      ...optHeaders,
    },
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`[sbFetch] ${options.method||"GET"} ${path} → ${res.status}:`, err);
    throw new Error(err);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

const rowToPlayer = (r) => ({
  id: r.id,
  name: r.name,
  tier: r.tier,
  boom: r.boom,
  gender: r.gender,
  remark: r.remark || "",
  phone: r.phone || "",
});

const rowsToPlayers = (rows) => {
  const male = rows.filter(r=>r.gender==="male").map(rowToPlayer);
  const female = rows.filter(r=>r.gender==="female").map(rowToPlayer);
  return { male, female };
};

export default function App(){
  const [tab,setTab]=useState("dashboard");
  const [players,setPlayers]=useState(INIT);
  const [search,setSearch]=useState("");
  const [filterTier,setFilterTier]=useState("all");
  const [filterGender,setFilterGender]=useState("all");
  const [showAddModal,setShowAddModal]=useState(false);
  const [adjModal,setAdjModal]=useState(null);
  const [newPlayer,setNewPlayer]=useState({name:"",tier:"3",gender:"male",remark:"",phone:""});
  const [adjForm,setAdjForm]=useState({type:"",value:0,note:""});
  const [editModal,setEditModal]=useState(null);
  const [editForm,setEditForm]=useState({name:"",tier:"3",gender:"male",remark:"",phone:""});
  const [deleteConfirm,setDeleteConfirm]=useState(null);
  const [history,setHistory]=useState([]);
  const [notif,setNotif]=useState(null);
  const [auth,setAuth]=useState(()=>{
    try {
      const saved = sessionStorage.getItem("pb_auth");
      if(saved){
        const {loggedIn,user} = JSON.parse(saved);
        if(loggedIn && user) return {loggedIn:true,user,showLogin:false,u:"",p:"",err:""};
      }
    } catch(e){}
    return {loggedIn:false,user:null,showLogin:false,u:"",p:"",err:""};
  });
  const [rankGender,setRankGender]=useState("male");
  const [dbReady,setDbReady]=useState(false);
  const [syncing,setSyncing]=useState(false);
  const [regForm,setRegForm]=useState({name:"",email:"",pvna:"",gender:"male",phone:"",note:""});
  const [regList,setRegList]=useState([]);
  const [regSubmitted,setRegSubmitted]=useState(false);
  const [regLoading,setRegLoading]=useState(false);
  const [showRegModal,setShowRegModal]=useState(false);
  const [tournaments,setTournaments]=useState([]);
  const [showTourModal,setShowTourModal]=useState(false);
  const [editTourModal,setEditTourModal]=useState(null); // tour being edited
  const [tourForm,setTourForm]=useState({name:"",date:"",format:"double",rounds:"1",note:"",pin:"",bestOf:"3",cover:""});
  const [activeTour,setActiveTour]=useState(null);
  const [showMatchModal,setShowMatchModal]=useState(false);
  const [matchForm,setMatchForm]=useState({p1:"",p2:"",p3:"",p4:"",score1:"",score2:"",round:"1"});
  const [viewTour,setViewTour]=useState(null);
  const [playerHistoryView,setPlayerHistoryView]=useState(null);
  const [mmSel,setMmSel]=useState([]);
  const [mmResult,setMmResult]=useState(null);
  const [tourRegForm,setTourRegForm]=useState({tourId:"",playerName:"",contact:"",content:"single",partner:"",note:""});
  const [showTourRegForm,setShowTourRegForm]=useState(null); // tour object for public registration modal
  const [tourRegSubmitted,setTourRegSubmitted]=useState(false);
  const [playerSearch,setPlayerSearch]=useState("");
  const [showPlayerPicker,setShowPlayerPicker]=useState(false);
  const [pickerTarget,setPickerTarget]=useState("playerName");
  const [regPlayerFocus,setRegPlayerFocus]=useState(false);
  const [regPartnerFocus,setRegPartnerFocus]=useState(false);
  const [showTourRegAdmin,setShowTourRegAdmin]=useState(null); // tourId being managed
  const [tourRegAdminTab,setTourRegAdminTab]=useState("pending");
  const [refMode,setRefMode]=useState(false); // fullscreen referee UI
  const [refPin,setRefPin]=useState("");
  const [refPinInput,setRefPinInput]=useState("");
  const [refPinErr,setRefPinErr]=useState("");
  const [refTour,setRefTour]=useState(null); // tournament unlocked by PIN
  const [refMatch,setRefMatch]=useState(null); // match being scored {id,team1,team2,round,format}
  const [refGames,setRefGames]=useState([]); // [{g1t1,g1t2},{g2t1,g2t2},...] each game score
  const [refConfirmed,setRefConfirmed]=useState(false);
  const [showGroupDrawModal,setShowGroupDrawModal]=useState(null); // tour object
  const [groupConfig,setGroupConfig]=useState({numGroups:2,seedBy:"tier",players:[]});
  const [editingMatchScore,setEditingMatchScore]=useState(null); // {matchId,s1,s2}
  const [viewTourTab,setViewTourTab]=useState("groups"); // "groups"|"schedule"|"knockout"
  const [knockoutBracket,setKnockoutBracket]=useState(null); // generated bracket

  const loadFromDB = async () => {
    setSyncing(true);
    try {
      const [pRows, hRows, rRows, tRows] = await Promise.all([
        sbFetch("players?select=*&order=id.asc"),
        sbFetch("history?select=*&order=created_at.desc&limit=100"),
        sbFetch("registrations?select=*&order=id.desc&limit=200"),
        sbFetch("tournaments?select=*&order=id.desc&limit=100"),
      ]);
      if (pRows && pRows.length > 0) {
        setPlayers(rowsToPlayers(pRows));
      } else {
        console.warn("[load] players empty, skipping auto-seed to prevent 401");
      }
      if (Array.isArray(hRows)) {
        setHistory(hRows.map(r=>({id:r.id,action:r.action,player:r.player,detail:r.detail||"",time:r.time||""})));
      }
      if (Array.isArray(rRows)) setRegList(rRows);
      if (Array.isArray(tRows) && tRows.length >= 0) {
        const tours = tRows.map(t=>({
          ...t,
          matches: typeof t.matches==="string" ? JSON.parse(t.matches||"[]") : (t.matches||[]),
          tourRegs: typeof t.tour_regs==="string" ? JSON.parse(t.tour_regs||"[]") : (t.tour_regs||[]),
          cover: t.cover||"",
          groups: typeof t.groups==="string" ? JSON.parse(t.groups||"[]") : (t.groups||[]),
        }));
        setTournaments(tours);
      }
      setDbReady(true);
      showNotif("Đã tải dữ liệu từ server");
    } catch(e) {
      console.error("Supabase load error:", e);
      showNotif("Lỗi kết nối server","err");
      setDbReady(true);
    }
    setSyncing(false);
  };

  useEffect(()=>{ loadFromDB(); }, []);

  // Auto-open reg form from share link ?reg=tourId
  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const regId=params.get("reg");
    if(regId&&tournaments.length){
      const tour=tournaments.find(t=>String(t.id)===String(regId));
      if(tour&&tour.status==="active"){
        setShowTourRegForm(tour);
        setTourRegForm({tourId:String(tour.id),playerName:"",contact:"",content:tour.format==="single"?"single":"double",partner:"",note:""});
        setTourRegSubmitted(false);
        setTab("tournament");
        // Clean URL without reload
        window.history.replaceState({},"",window.location.pathname);
      }
    }
  },[tournaments]);

  const seedDatabase = async () => {
    const allInit = [
      ...INIT.male.map(p=>({id:p.id,name:p.name,tier:p.tier,boom:p.boom,gender:"male",remark:p.remark||""})),
      ...INIT.female.map(p=>({id:p.id,name:p.name,tier:p.tier,boom:p.boom,gender:"female",remark:p.remark||""})),
    ];
    await sbFetch("players", {
      method:"POST",
      headers:{"Prefer":"return=minimal"},
      body: JSON.stringify(allInit),
    });
  };

  const allPlayers=useMemo(()=>[
    ...players.male.map(p=>({...p,gender:"male"})),
    ...players.female.map(p=>({...p,gender:"female"})),
  ],[players]);

  const filtered=useMemo(()=>allPlayers.filter(p=>{
    const ms=p.name.toLowerCase().includes(search.toLowerCase());
    const mt=filterTier==="all"||p.tier===filterTier;
    const mg=filterGender==="all"||p.gender===filterGender;
    return ms&&mt&&mg;
  }),[allPlayers,search,filterTier,filterGender]);

  const stats=useMemo(()=>{
    const tc={};
    allPlayers.forEach(p=>{tc[p.tier]=(tc[p.tier]||0)+1;});
    return{total:allPlayers.length,male:players.male.length,female:players.female.length,tc,avg:(allPlayers.reduce((s,p)=>s+p.boom,0)/allPlayers.length).toFixed(2)};
  },[allPlayers,players]);

  const topMale=useMemo(()=>[...players.male].sort((a,b)=>b.boom-a.boom).slice(0,5),[players]);
  const topFemale=useMemo(()=>[...players.female].sort((a,b)=>b.boom-a.boom).slice(0,5),[players]);

  const isAdmin=auth.loggedIn;
  const userRole = auth.user?.role || null;
  const perms = userRole ? ROLE_PERMISSIONS[userRole] : {};
  const can = (perm) => !!perms[perm];

  const showNotif=(msg,type="ok")=>{
    setNotif({msg,type});
    setTimeout(()=>setNotif(null),3000);
  };

  const addHistory = async (action, player, detail) => {
    const entry = {id:Date.now(),action,player,detail,time:new Date().toLocaleString("vi-VN")};
    setHistory(h=>[entry,...h]);
    try {
      await sbFetch("history", {
        method:"POST",
        body: JSON.stringify({id:entry.id,action,player,detail,time:entry.time}),
      });
    } catch(e){ console.error("history write:", e); }
  };

  const handleLogin=()=>{
    const found=ADMIN_CREDENTIALS.find(c=>c.username===auth.u&&c.password===auth.p);
    if(found){
      sessionStorage.setItem("pb_auth", JSON.stringify({loggedIn:true,user:found}));
      setAuth(a=>({...a,loggedIn:true,user:found,showLogin:false,err:"",u:"",p:""}));
      showNotif("Đăng nhập thành công");
    }
    else setAuth(a=>({...a,err:"Sai tên đăng nhập hoặc mật khẩu"}));
  };
  const handleLogout=()=>{sessionStorage.removeItem("pb_auth");setAuth({loggedIn:false,user:null,showLogin:false,u:"",p:"",err:""});if(["roles"].includes(tab))setTab("dashboard");showNotif("Đã đăng xuất");};

  const handleRegister=async()=>{
    if(!regForm.name.trim()||!regForm.phone.trim())return;
    const phone=regForm.phone.trim();
    const dupPlayer=allPlayers.find(p=>p.phone&&p.phone===phone);
    if(dupPlayer){showNotif("SĐT đã đăng ký: "+dupPlayer.name,"err");setRegLoading(false);return;}
    const dupReg=regList.find(r=>r.phone&&r.phone===phone&&r.status==="pending");
    if(dupReg){showNotif("SĐT đang chờ duyệt ("+dupReg.name+")","err");setRegLoading(false);return;}
    setRegLoading(true);
    const entry={id:Date.now(),name:regForm.name.trim(),phone,email:regForm.email.trim(),pvna:regForm.pvna.trim(),gender:regForm.gender,note:regForm.note.trim(),time:new Date().toLocaleString("vi-VN"),status:"pending"};
    setRegList(prev=>[entry,...prev]);
    try{await sbFetch("registrations",{method:"POST",headers:{"Prefer":"return=minimal"},body:JSON.stringify(entry)});}catch(e){console.error("reg:",e);}
    setRegSubmitted(true);
    setRegLoading(false);
    setRegForm({name:"",email:"",pvna:"",gender:"male",phone:"",note:""});
  };

  const handleApproveReg=async(reg)=>{
    setRegList(prev=>prev.map(r=>r.id===reg.id?{...r,status:"approved"}:r));
    if(reg.phone){
      const matched=allPlayers.find(p=>p.name.trim().toLowerCase()===reg.name.trim().toLowerCase()&&!p.phone);
      if(matched){
        setPlayers(prev=>({...prev,[matched.gender]:prev[matched.gender].map(p=>p.id===matched.id?{...p,phone:reg.phone}:p)}));
        try{await sbFetch(`players?id=eq.${matched.id}`,{method:"PATCH",body:JSON.stringify({phone:reg.phone})});}catch(e){console.error(e);}
      }
    }
    try{await sbFetch(`registrations?id=eq.${reg.id}`,{method:"PATCH",body:JSON.stringify({status:"approved"})});}catch(e){console.error(e);}
    showNotif("Đã duyệt: "+reg.name);
  };

  const handleRejectReg=async(reg)=>{
    setRegList(prev=>prev.map(r=>r.id===reg.id?{...r,status:"rejected"}:r));
    try{await sbFetch(`registrations?id=eq.${reg.id}`,{method:"PATCH",body:JSON.stringify({status:"rejected"})});}catch(e){console.error(e);}
    showNotif(`Đã từ chối: ${reg.name}`,"err");
  };

  const handleAddPlayer=async()=>{
    if(!newPlayer.name.trim())return;
    const boom=TIER_BOOM[newPlayer.tier]||2.5;
    const id=Date.now();
    const phone=(newPlayer.phone||"").trim();
    if(phone){
      const dup=allPlayers.find(pl=>pl.phone&&pl.phone===phone);
      if(dup){showNotif("SĐT đã tồn tại: "+dup.name,"err");return;}
    }
    const p={id,name:newPlayer.name,tier:newPlayer.tier,boom,gender:newPlayer.gender,remark:newPlayer.remark||"",phone};
    setPlayers(prev=>({...prev,[newPlayer.gender]:[...prev[newPlayer.gender],p]}));
    setNewPlayer({name:"",tier:"3",gender:"male",remark:"",phone:""});
    setShowAddModal(false);
    showNotif("Đã thêm VĐV "+newPlayer.name);
    try {
      await sbFetch("players",{method:"POST",body:JSON.stringify({id,name:p.name,tier:p.tier,boom:p.boom,gender:p.gender,remark:p.remark||"",phone})});
    } catch(e){ console.error("add player:",e); }
    await addHistory("Thêm VĐV", newPlayer.name, `Tier ${newPlayer.tier}`);
  };

  const handleAdjust=async()=>{
    const p=adjModal;
    const val=parseFloat(adjForm.value);
    if(isNaN(val))return;
    const newBoom=Math.round((p.boom+val)*1000)/1000;
    setPlayers(prev=>({...prev,[p.gender]:prev[p.gender].map(pl=>pl.id===p.id?{...pl,boom:newBoom}:pl)}));
    setAdjModal(null);setAdjForm({type:"",value:0,note:""});
    showNotif(`Đã cập nhật điểm ${p.name}`);
    try {
      await sbFetch(`players?id=eq.${p.id}`,{method:"PATCH",body:JSON.stringify({boom:newBoom})});
    } catch(e){ console.error("adjust:",e); }
    await addHistory("Điều chỉnh điểm", p.name, `${val>0?"+":""}${val} | ${adjForm.note||adjForm.type||"—"}`);
  };

  const handleTierChange=async(p,newTier)=>{
    const newBoom=TIER_BOOM[newTier];
    setPlayers(prev=>({...prev,[p.gender]:prev[p.gender].map(pl=>pl.id===p.id?{...pl,tier:newTier,boom:newBoom}:pl)}));
    showNotif(`Cập nhật Tier ${p.name}`);
    try {
      await sbFetch(`players?id=eq.${p.id}`,{method:"PATCH",body:JSON.stringify({tier:newTier,boom:newBoom})});
    } catch(e){ console.error("tier change:",e); }
    await addHistory("Đổi Tier", p.name, `${p.tier} → ${newTier}`);
  };

  const handleDeletePlayer=async(p)=>{
    setPlayers(prev=>({...prev,[p.gender]:prev[p.gender].filter(pl=>pl.id!==p.id)}));
    setDeleteConfirm(null);
    showNotif(`Đã xóa VĐV ${p.name}`,"ok");
    try {
      await sbFetch(`players?id=eq.${p.id}`,{method:"DELETE"});
    } catch(e){ console.error("delete:",e); }
    await addHistory("Xóa VĐV", p.name, `Tier ${p.tier} | ${p.gender==="male"?"Nam":"Nữ"}`);
  };

  const handleEditPlayer=async()=>{
    const p=editModal;
    if(!editForm.name.trim())return;
    const newBoom=editForm.tier!==p.tier?TIER_BOOM[editForm.tier]:p.boom;
    const newRemark=editForm.remark||"";
    const newPhone=(editForm.phone||"").trim();
    if(newPhone&&newPhone!==p.phone){
      const dup=allPlayers.find(pl=>pl.id!==p.id&&pl.phone&&pl.phone===newPhone);
      if(dup){showNotif("SĐT đã tồn tại: "+dup.name,"err");return;}
    }
    if(editForm.gender!==p.gender){
      setPlayers(prev=>({
        ...prev,
        [p.gender]:prev[p.gender].filter(pl=>pl.id!==p.id),
        [editForm.gender]:[...prev[editForm.gender],{...p,name:editForm.name,tier:editForm.tier,boom:newBoom,gender:editForm.gender,remark:newRemark,phone:newPhone}],
      }));
    } else {
      setPlayers(prev=>({...prev,[p.gender]:prev[p.gender].map(pl=>pl.id===p.id?{...pl,name:editForm.name,tier:editForm.tier,boom:newBoom,remark:newRemark,phone:newPhone}:pl)}));
    }
    setEditModal(null);
    showNotif(`Đã cập nhật VĐV ${editForm.name}`);
    try {
      await sbFetch(`players?id=eq.${p.id}`,{method:"PATCH",body:JSON.stringify({name:editForm.name,tier:editForm.tier,boom:newBoom,gender:editForm.gender,remark:newRemark,phone:newPhone})});
    } catch(e){ console.error("edit:",e); }
    await addHistory("Sửa VĐV", editForm.name, `Tier ${editForm.tier} | ${editForm.gender==="male"?"Nam":"Nữ"}`);
  };

  const handleResetData=async()=>{
    const allInit=[
      ...INIT.male.map(p=>({id:p.id,name:p.name,tier:p.tier,boom:p.boom,gender:"male"})),
      ...INIT.female.map(p=>({id:p.id,name:p.name,tier:p.tier,boom:p.boom,gender:"female"})),
    ];
    setPlayers(INIT);
    setHistory([]);
    showNotif("Đã khôi phục dữ liệu gốc");
    try {
      await sbFetch("players",{method:"DELETE",headers:{"Prefer":"return=minimal"}});
      await sbFetch("history",{method:"DELETE",headers:{"Prefer":"return=minimal"}});
      await sbFetch("players",{method:"POST",body:JSON.stringify(allInit)});
    } catch(e){ console.error("reset:",e); }
  };

  const toggleMm=(p)=>{
    setMmResult(null);
    setMmSel(prev=>prev.find(x=>x.id===p.id)?prev.filter(x=>x.id!==p.id):prev.length>=4?prev:[...prev,p]);
  };

  const handleCreateTour = async () => {
    if(!tourForm.name.trim()||!tourForm.date.trim()) return;
    const id = Date.now();
    const pin = tourForm.pin.trim() || Math.floor(1000+Math.random()*9000).toString();
    const tour = {id, name:tourForm.name.trim(), date:tourForm.date, format:tourForm.format, rounds:parseInt(tourForm.rounds)||1, note:tourForm.note.trim(), matches:[], status:"active", created:new Date().toLocaleString("vi-VN"), pin, bestOf:parseInt(tourForm.bestOf)||3, cover:tourForm.cover||""};
    setTournaments(prev=>[tour,...prev]);
    setShowTourModal(false);
    setTourForm({name:"",date:"",format:"double",rounds:"1",note:"",pin:"",bestOf:"3",cover:""});
    setActiveTour(tour);
    setTab("tournament");
    showNotif("Đã tạo giải: "+tour.name);
    try {
      const payload = {
        id: tour.id,
        name: tour.name,
        date: tour.date,
        format: tour.format,
        rounds: tour.rounds,
        note: tour.note,
        matches: "[]",
        tour_regs: "[]",
        status: "active",
        created: tour.created,
        pin: tour.pin,
        best_of: tour.bestOf,
        cover: tour.cover||"",
      };
      await sbFetch("tournaments", {method:"POST", headers:{"Prefer":"return=minimal"}, body:JSON.stringify(payload)});
    } catch(e){console.error("create tour error:",e);}
  };

  const handleAddMatch = async () => {
    if(!activeTour) return;
    const {p1,p2,p3,p4,score1,score2,round} = matchForm;
    if(!p1||!score1||!score2) return;
    const isDouble = activeTour.format==="double";
    const match = {
      id: Date.now(),
      round: parseInt(round)||1,
      format: activeTour.format,
      team1: isDouble ? [p1,p2].filter(Boolean) : [p1],
      team2: isDouble ? [p3,p4].filter(Boolean) : [p3],
      score1: parseInt(score1)||0,
      score2: parseInt(score2)||0,
      time: new Date().toLocaleString("vi-VN"),
    };
    const updatedMatches = [...(activeTour.matches||[]), match];
    const updatedTour = {...activeTour, matches: updatedMatches};
    setTournaments(prev=>prev.map(t=>t.id===activeTour.id?updatedTour:t));
    setActiveTour(updatedTour);
    setShowMatchModal(false);
    setMatchForm({p1:"",p2:"",p3:"",p4:"",score1:"",score2:"",round:"1"});
    showNotif("Đã thêm kết quả trận đấu");
    try { await sbFetch(`tournaments?id=eq.${activeTour.id}`,{method:"PATCH",body:JSON.stringify({matches:JSON.stringify(updatedMatches)})}); } catch(e){console.error(e);}
  };

  const handleUpdateTour = async () => {
    if(!editTourModal||!editTourModal.form.name.trim()||!editTourModal.form.date.trim()) return;
    const {form, tour} = editTourModal;
    const updated = {
      ...tour,
      name: form.name.trim(),
      date: form.date.trim(),
      format: form.format,
      rounds: parseInt(form.rounds)||1,
      note: form.note.trim(),
      pin: form.pin.trim()||tour.pin,
      bestOf: parseInt(form.bestOf)||3,
      cover: form.cover!==undefined ? form.cover : (tour.cover||""),
    };
    setTournaments(prev=>prev.map(t=>t.id===tour.id?updated:t));
    if(activeTour?.id===tour.id) setActiveTour(updated);
    if(viewTour?.id===tour.id) setViewTour(updated);
    setEditTourModal(null);
    showNotif("Đã cập nhật giải: "+updated.name);
    try {
      await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({
        name: updated.name,
        date: updated.date,
        format: updated.format,
        rounds: updated.rounds,
        note: updated.note,
        pin: updated.pin,
        best_of: updated.bestOf,
        cover: updated.cover||"",
      })});
    } catch(e){console.error("update tour error:",e);}
  };

  const handleEndTour = async (tour) => {
    const updated = {...tour, status:"finished"};
    setTournaments(prev=>prev.map(t=>t.id===tour.id?updated:t));
    if(activeTour?.id===tour.id) setActiveTour(updated);
    showNotif("Đã kết thúc giải: "+tour.name);
    try { await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({status:"finished"})}); } catch(e){console.error(e);}
  };

  const handleDeleteTour = async (tour) => {
    setTournaments(prev=>prev.filter(t=>t.id!==tour.id));
    if(activeTour?.id===tour.id){setActiveTour(null);setTab("tournament");}
    if(viewTour?.id===tour.id) setViewTour(null);
    showNotif("Đã xóa giải: "+tour.name,"err");
    try { await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"DELETE"}); } catch(e){console.error(e);}
  };

  const getPlayerStats = (playerName) => {
    let wins=0,losses=0,totalMatches=0,tourList=[],matchHistory=[];
    tournaments.forEach(tour=>{
      let inTour=false;
      (tour.matches||[]).forEach(m=>{
        const inT1=(m.team1||[]).includes(playerName);
        const inT2=(m.team2||[]).includes(playerName);
        if(!inT1&&!inT2) return;
        inTour=true; totalMatches++;
        const won=(inT1&&m.score1>m.score2)||(inT2&&m.score2>m.score1);
        const drew=m.score1===m.score2;
        if(won) wins++; else if(!drew) losses++;
        matchHistory.push({
          tourName:tour.name, tourDate:tour.date, tourId:tour.id,
          round:m.round, opponent:inT1?(m.team2||[]).join(" & "):(m.team1||[]).join(" & "),
          myScore:inT1?m.score1:m.score2, oppScore:inT1?m.score2:m.score1,
          won, drew, time:m.time, format:m.format||tour.format,
        });
      });
      if(inTour) tourList.push(tour.name);
    });
    matchHistory.sort((a,b)=>b.tourId-a.tourId);
    return {wins,losses,totalMatches,winRate:totalMatches?Math.round(wins/totalMatches*100):0,tourList:[...new Set(tourList)],matchHistory};
  };

  const handleTourRegister = async () => {
    const {tourId,playerName,contact,content,partner,note} = tourRegForm;
    if(!tourId||!playerName) return;
    const tour = tournaments.find(t=>t.id===parseInt(tourId)||t.id===tourId);
    if(!tour) return;
    const entry = {id:Date.now(),tourId:tour.id,tourName:tour.name,playerName,contact,content,partner,note,status:"pending",time:new Date().toLocaleString("vi-VN")};
    const updatedRegs = [...(tour.tourRegs||[]), entry];
    const updatedTour = {...tour, tourRegs: updatedRegs};
    setTournaments(prev=>prev.map(t=>t.id===tour.id?updatedTour:t));
    if(activeTour?.id===tour.id) setActiveTour(updatedTour);
    setTourRegSubmitted(true);
    setTourRegForm({tourId:"",playerName:"",contact:"",content:"single",partner:"",note:""});
    showNotif("Đã đăng ký giải: "+tour.name);
    try {
      await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({"tour_regs":JSON.stringify(updatedRegs)})});
    } catch(e){console.error(e);}
  };

  const handleTourRegApprove = async (tour, regId) => {
    const reg = (tour.tourRegs||[]).find(r=>r.id===regId);
    const updatedRegs = (tour.tourRegs||[]).map(r=>r.id===regId?{...r,status:"approved",approvedBy:auth.user?.label||"Admin",approvedAt:new Date().toLocaleString("vi-VN")}:r);
    const updatedTour = {...tour, tourRegs: updatedRegs};
    setTournaments(prev=>prev.map(t=>t.id===tour.id?updatedTour:t));
    if(activeTour?.id===tour.id) setActiveTour(updatedTour);
    if(showTourRegAdmin?.id===tour.id) setShowTourRegAdmin(updatedTour);
    if(viewTour?.id===tour.id) setViewTour(updatedTour);
    showNotif("Đã duyệt: "+(reg?.playerName||""));
    try { await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({"tour_regs":JSON.stringify(updatedRegs)})}); } catch(e){console.error(e);}
  };

  const handleTourRegReject = async (tour, regId, reason="") => {
    const reg = (tour.tourRegs||[]).find(r=>r.id===regId);
    const updatedRegs = (tour.tourRegs||[]).map(r=>r.id===regId?{...r,status:"rejected",rejectedBy:auth.user?.label||"Admin",rejectedAt:new Date().toLocaleString("vi-VN"),rejectReason:reason}:r);
    const updatedTour = {...tour, tourRegs: updatedRegs};
    setTournaments(prev=>prev.map(t=>t.id===tour.id?updatedTour:t));
    if(activeTour?.id===tour.id) setActiveTour(updatedTour);
    if(showTourRegAdmin?.id===tour.id) setShowTourRegAdmin(updatedTour);
    if(viewTour?.id===tour.id) setViewTour(updatedTour);
    showNotif("Đã từ chối: "+(reg?.playerName||""),"err");
    try { await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({"tour_regs":JSON.stringify(updatedRegs)})}); } catch(e){console.error(e);}
  };

  const handleTourRegCancel = async (tour, regId) => {
    const updatedRegs = (tour.tourRegs||[]).map(r=>r.id===regId?{...r,status:"cancelled"}:r);
    const updatedTour = {...tour, tourRegs: updatedRegs};
    setTournaments(prev=>prev.map(t=>t.id===tour.id?updatedTour:t));
    if(activeTour?.id===tour.id) setActiveTour(updatedTour);
    if(viewTour?.id===tour.id) setViewTour(updatedTour);
    showNotif("Đã hủy đăng ký");
    try { await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({"tour_regs":JSON.stringify(updatedRegs)})}); } catch(e){console.error(e);}
  };

  const openGroupDraw = (tour) => {
    const approved = (tour.tourRegs||[]).filter(r=>r.status==="approved");
    const allP = [...players.male.map(p=>({...p,gender:"male"})),...players.female.map(p=>({...p,gender:"female"}))];
    const findBoom = (name) => { const found = allP.find(p=>p.name===name); return found ? found.boom : 2.1; };
    const entries = [];
    approved.forEach(r => {
      if(r.content==="single"){ entries.push({name:r.playerName,boom:findBoom(r.playerName),regId:r.id,type:"single"}); }
      else { entries.push({name:r.playerName+(r.partner?" / "+r.partner:""),boom:(findBoom(r.playerName)+(r.partner?findBoom(r.partner):0))/(r.partner?2:1),regId:r.id,type:r.content,partner:r.partner||""}); }
    });
    const entries2 = entries;
    setGroupConfig({numGroups:Math.min(4,Math.max(2,Math.ceil(entries2.length/4))),seedBy:"tier",players:entries2.map(p=>({...p,selected:true}))});
    setShowGroupDrawModal(tour);
  };
  const handleGenerateGroups = async () => {
    if(!showGroupDrawModal) return;
    const tour = showGroupDrawModal;
    const {numGroups, seedBy, players} = groupConfig;
    const selected = players.filter(p=>p.selected);
    if(selected.length < 2) { showNotif("Cần ít nhất 2 người chơi","err"); return; }
    const n = parseInt(numGroups)||2;
    let sorted = [...selected];
    if(seedBy==="tier") sorted.sort((a,b)=>b.boom-a.boom);
    else if(seedBy==="random") sorted.sort(()=>Math.random()-0.5);
    const groups = Array.from({length:n},(_,i)=>({name:"Bảng "+String.fromCharCode(65+i),players:[],matches:[]}));
    sorted.forEach((p,idx)=>{
      const round = Math.floor(idx/n);
      const pos = round%2===0 ? idx%n : n-1-(idx%n);
      groups[pos].players.push(p.name);
    });
    const updatedTour = {...tour, groups};
    setTournaments(prev=>prev.map(t=>t.id===tour.id?updatedTour:t));
    if(viewTour?.id===tour.id) setViewTour(updatedTour);
    if(activeTour?.id===tour.id) setActiveTour(updatedTour);
    setShowGroupDrawModal(null);
    showNotif("Đã chia "+n+" bảng thành công!");
    try { await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({groups:JSON.stringify(groups)})}); } catch(e){console.error(e);}
  };
  const handleDeleteGroups = async (tour) => {
    const updatedTour = {...tour, groups:[]};
    setTournaments(prev=>prev.map(t=>t.id===tour.id?updatedTour:t));
    if(viewTour?.id===tour.id) setViewTour(updatedTour);
    if(activeTour?.id===tour.id) setActiveTour(updatedTour);
    showNotif("Đã xóa bảng đấu","err");
    try { await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({groups:"[]"})}); } catch(e){console.error(e);}
  };

  const handleAutoGenerateMatches = async (tour) => {
    const groups = tour.groups || [];
    if(!groups.length){ showNotif("Cần chia bảng trước","err"); return; }
    const newMatches = [];
    groups.forEach(g => {
      const ps = g.players || [];
      for(let i=0;i<ps.length;i++){
        for(let j=i+1;j<ps.length;j++){
          newMatches.push({
            id: Date.now()+"-"+Math.random().toString(36).slice(2,7),
            group: g.name,
            p1: ps[i], p2: ps[j],
            score1: null, score2: null,
            status: "pending",
            date: new Date().toLocaleDateString("vi-VN"),
          });
        }
      }
    });
    if(!newMatches.length){ showNotif("Không có trận nào được tạo","err"); return; }
    const existing = tour.matches || [];
    const merged = [...existing, ...newMatches];
    const updatedTour = {...tour, matches: merged};
    setTournaments(prev=>prev.map(t=>t.id===tour.id?updatedTour:t));
    if(viewTour?.id===tour.id) setViewTour(updatedTour);
    if(activeTour?.id===tour.id) setActiveTour(updatedTour);
    showNotif("Đã tạo "+newMatches.length+" trận thi đấu!");
    try { await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({matches:JSON.stringify(merged)})}); } catch(e){console.error(e);}
  };

  const handleUpdateMatchScore = async (tour, matchId, score1, score2) => {
    const matches = (tour.matches||[]).map(m =>
      m.id===matchId ? {...m, score1, score2, status:"done"} : m
    );
    const updatedTour = {...tour, matches};
    setTournaments(prev=>prev.map(t=>t.id===tour.id?updatedTour:t));
    if(viewTour?.id===tour.id) setViewTour(updatedTour);
    if(activeTour?.id===tour.id) setActiveTour(updatedTour);
    try { await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({matches:JSON.stringify(matches)})}); } catch(e){console.error(e);}
  };

  const handleDeleteScheduledMatch = async (tour, matchId) => {
    const matches = (tour.matches||[]).filter(m=>m.id!==matchId);
    const updatedTour = {...tour, matches};
    setTournaments(prev=>prev.map(t=>t.id===tour.id?updatedTour:t));
    if(viewTour?.id===tour.id) setViewTour(updatedTour);
    if(activeTour?.id===tour.id) setActiveTour(updatedTour);
    try { await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({matches:JSON.stringify(matches)})}); } catch(e){console.error(e);}
  };

  const generateKnockoutFromGroups = (tour) => {
    const groups = tour.groups || [];
    if(!groups.length) return null;
    const scheduled = (tour.matches||[]).filter(m=>m.group);
    // Build standings per group
    const groupStandings = groups.map(g => {
      const playerNames = g.players || [];
      const standings = playerNames.map(name => {
        const gMatches = scheduled.filter(m=>m.group===g.name&&m.status==="done");
        const wins = gMatches.filter(m=>(m.p1===name&&m.score1>m.score2)||(m.p2===name&&m.score2>m.score1)).length;
        const losses = gMatches.filter(m=>(m.p1===name&&m.score1<m.score2)||(m.p2===name&&m.score2<m.score1)).length;
        const played = wins+losses;
        const ptsFor = gMatches.reduce((s,m)=>s+(m.p1===name?(m.score1||0):(m.p2===name?(m.score2||0):0)),0);
        const ptsAgainst = gMatches.reduce((s,m)=>s+(m.p1===name?(m.score2||0):(m.p2===name?(m.score1||0):0)),0);
        return {name,wins,losses,played,ptsFor,ptsAgainst,diff:ptsFor-ptsAgainst};
      }).sort((a,b)=>b.wins-a.wins||b.diff-a.diff);
      return {name:g.name, standings};
    });
    // Pick top 2 from each group for knockout
    const advancers = groupStandings.flatMap(g=>g.standings.slice(0,2));
    // Build round of 16/QF/SF depending on count
    const n = advancers.length;
    // Pair: 1st group A vs 2nd group B, 1st group B vs 2nd group A, etc.
    const pairs = [];
    const half = Math.ceil(groupStandings.length/2);
    for(let i=0;i<half;i++){
      const g1 = groupStandings[i];
      const g2 = groupStandings[i+half] || groupStandings[(i+1)%groupStandings.length];
      if(g1&&g2){
        pairs.push({id:"ko-"+i+"-0",p1:g1.standings[0]?.name||"TBD",p2:g2.standings[1]?.name||"TBD",score1:null,score2:null,round:"QF"});
        pairs.push({id:"ko-"+i+"-1",p1:g2.standings[0]?.name||"TBD",p2:g1.standings[1]?.name||"TBD",score1:null,score2:null,round:"QF"});
      }
    }
    if(!pairs.length){
      // Fallback: simple bracket from all advancers
      for(let i=0;i<advancers.length;i+=2){
        if(advancers[i+1]) pairs.push({id:"ko-"+i,p1:advancers[i].name,p2:advancers[i+1].name,score1:null,score2:null,round:"QF"});
      }
    }
    // Semi-finals slots
    const semis = pairs.slice(0,4).map((_,i)=>({id:"sf-"+i,p1:"W QF"+(i*2+1),p2:"W QF"+(i*2+2),score1:null,score2:null,round:"SF"}));
    // Final
    const final = [{id:"final-0",p1:"W SF1",p2:"W SF2",score1:null,score2:null,round:"F"},{id:"bronze-0",p1:"L SF1",p2:"L SF2",score1:null,score2:null,round:"3rd"}];
    return {groupStandings, qf:pairs, sf:semis.slice(0,2), final};
  };

  const handleSaveKnockoutScore = async (tour, matchId, score1, score2, bracket) => {
    const updatedBracket = JSON.parse(JSON.stringify(bracket));
    ["qf","sf","final"].forEach(round=>{
      if(updatedBracket[round]) updatedBracket[round]=updatedBracket[round].map(m=>m.id===matchId?{...m,score1,score2,done:true}:m);
    });
    // Propagate winners to next round
    const getWinner = (m) => m.done ? (m.score1>m.score2?m.p1:m.p2) : null;
    const getLoser = (m) => m.done ? (m.score1>m.score2?m.p2:m.p1) : null;
    // QF winners → SF
    updatedBracket.qf.forEach((m,i)=>{
      const w=getWinner(m);
      if(w&&updatedBracket.sf[Math.floor(i/2)]){
        if(i%2===0) updatedBracket.sf[Math.floor(i/2)].p1=w;
        else updatedBracket.sf[Math.floor(i/2)].p2=w;
      }
    });
    // SF winners → Final, losers → 3rd place
    updatedBracket.sf.forEach((m,i)=>{
      const w=getWinner(m); const l=getLoser(m);
      if(w&&updatedBracket.final[0]){ if(i===0) updatedBracket.final[0].p1=w; else updatedBracket.final[0].p2=w; }
      if(l&&updatedBracket.final[1]){ if(i===0) updatedBracket.final[1].p1=l; else updatedBracket.final[1].p2=l; }
    });
    setKnockoutBracket(updatedBracket);
    try { await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({knockout:JSON.stringify(updatedBracket)})}); } catch(e){console.error(e);}
  };

  const handleRefPinSubmit = () => {
    const tour = tournaments.find(t => t.pin === refPinInput && t.status === "active");
    if(tour){ setRefTour(tour); setRefPinErr(""); setRefPinInput(""); }
    else setRefPinErr("Mã PIN không đúng hoặc giải đã kết thúc");
  };

  const handleRefStartMatch = (match) => {
    const numGames = refTour?.bestOf || 3;
    setRefMatch(match);
    setRefGames(Array.from({length:numGames},()=>({t1:"",t2:""})));
    setRefConfirmed(false);
  };

  const handleRefSaveMatch = async () => {
    if(!refTour || !refMatch) return;
    let s1=0, s2=0;
    refGames.forEach(g => {
      const g1=parseInt(g.t1)||0, g2=parseInt(g.t2)||0;
      if(g1>0||g2>0){ if(g1>g2) s1++; else if(g2>g1) s2++; }
    });
    const updatedMatch = {
      ...refMatch,
      score1: s1,
      score2: s2,
      games: refGames.map(g=>({t1:parseInt(g.t1)||0,t2:parseInt(g.t2)||0})),
      confirmed: true,
      confirmedAt: new Date().toLocaleString("vi-VN"),
    };
    const existing = (refTour.matches||[]).find(m=>m.id===refMatch.id);
    const updatedMatches = existing
      ? (refTour.matches||[]).map(m=>m.id===refMatch.id ? updatedMatch : m)
      : [...(refTour.matches||[]), updatedMatch];
    const updatedTour = {...refTour, matches: updatedMatches};
    setTournaments(prev=>prev.map(t=>t.id===refTour.id ? updatedTour : t));
    setRefTour(updatedTour);
    setRefConfirmed(true);
    try { await sbFetch(`tournaments?id=eq.${refTour.id}`,{method:"PATCH",body:JSON.stringify({matches:JSON.stringify(updatedMatches)})}); }
    catch(e){console.error(e);}
  };

  const handleRefExitMatch = () => { setRefMatch(null); setRefGames([]); setRefConfirmed(false); };

  const NAV=[
    {key:"dashboard",icon:"dashboard",label:"Tổng quan"},
    {key:"players",icon:"players",label:"VĐV"},
    {key:"ranking",icon:"ranking",label:"Xếp hạng"},
    {key:"tournament",icon:"tournament",label:"Giải đấu"},
    {key:"roles",icon:"roles",label:"Phân quyền",adminOnly:true},

    {key:"history",icon:"history",label:"Lịch sử"},
    {key:"rules",icon:"rules",label:"Quy định"},
  ];

  useEffect(()=>{
    if(!document.querySelector('meta[name="viewport"]')){
      const vm=document.createElement("meta");
      vm.name="viewport";
      vm.content="width=device-width,initial-scale=1,maximum-scale=1,viewport-fit=cover";
      document.head.appendChild(vm);
    }
    const el=document.createElement("style");
    el.textContent=`
      @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@600;700;800&display=swap');
      *,*::before,*::after{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
      html,body{margin:0;padding:0;overflow:hidden;height:100%;-webkit-text-size-adjust:100%;}
      body{overscroll-behavior-y:auto;}
      input,select,textarea,button{font-family:inherit;-webkit-appearance:none;appearance:none;}
      select{-webkit-appearance:none;appearance:none;}
      ::-webkit-scrollbar{width:4px;height:4px;}
      ::-webkit-scrollbar-track{background:transparent;}
      ::-webkit-scrollbar-thumb{background:rgba(236,122,28,0.3);border-radius:4px;}
      @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
      ::-webkit-scrollbar{width:4px;height:4px;}
      ::-webkit-scrollbar-track{background:#28281f;}
      ::-webkit-scrollbar-thumb{background:#44443b;border-radius:2px;}
      ::-webkit-scrollbar-thumb:hover{background:#ec7a1c;}
      button{font-family:'Barlow',system-ui,sans-serif;}
      h1,h2,h3{font-family:'Barlow Condensed',system-ui,sans-serif;letter-spacing:0.3px;}
    `;
    document.head.appendChild(el);
    return()=>document.head.removeChild(el);
  },[]);

  return (
    <>
    <div style={{height:"100dvh",background:"#1e1e1a",color:C.text,fontFamily:"'Barlow',system-ui,sans-serif",overflowX:"hidden",overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
      <div style={{position:"fixed",top:-150,left:-150,width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(236,122,28,0.09) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:-120,right:-120,width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,180,71,0.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>

      <header style={{background:"rgba(28,28,22,0.98)",borderBottom:"2px solid "+C.border,position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 24px rgba(0,0,0,0.55)",paddingTop:"env(safe-area-inset-top,0px)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",maxWidth:900,margin:"0 auto",gap:8,minWidth:0}}>
          <div onClick={()=>setTab("dashboard")} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
            <img src="data:image/png;base64,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" alt="PickleBoom" style={{height:48,width:"auto",objectFit:"contain",filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.5))"}} />
          </div>
          {isAdmin?(
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{textAlign:"right",minWidth:0,overflow:"hidden"}}>
                  <div style={{fontSize:10,color:ROLE_PERMISSIONS[userRole]?.color||"#ec7a1c",fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}><Icon n={ROLE_PERMISSIONS[userRole]?.badge||"roles"} size={10} color={ROLE_PERMISSIONS[userRole]?.color||"#ec7a1c"} style={{marginRight:3}}/>{auth.user.label}</div>
                  <div style={{fontSize:9,color:C.dim}}>Admin</div>
                </div>
                <button onClick={handleLogout} style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.35)",color:"#EF4444",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>Đăng xuất</button>
                <button onClick={()=>{if(can("canResetData")&&window.confirm("Reset toàn bộ dữ liệu về mặc định?"))handleResetData();}} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.dim,borderRadius:8,padding:"6px 8px",cursor:"pointer",fontSize:13,fontWeight:700,flexShrink:0}} title="Reset dữ liệu gốc">↺</button>
              </div>
              <div style={{fontSize:9,color:C.dim,letterSpacing:1}}><span style={{color:dbReady?"#4ADE80":"#e6a53a"}}>{dbReady?"● Online":"● Connecting..."}</span></div>
            </div>
          ):(
<div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>{setRefMode(true);setRefTour(null);setRefPinInput("");setRefPinErr("");}} style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.35)",color:"#f4954a",borderRadius:8,padding:"7px 10px",cursor:"pointer",fontSize:12,fontWeight:700}}>
                  ️ Trọng tài
                </button>
                <button onClick={()=>setAuth(a=>({...a,showLogin:true}))} style={{background:"rgba(236,122,28,0.12)",border:"1px solid rgba(236,122,28,0.35)",color:"#ec7a1c",borderRadius:8,padding:"7px 12px",cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:5}}>
                  <Icon n="key" size={14} style={{marginRight:4}}/>Đăng nhập
                </button>
              </div>
              <div style={{fontSize:9,color:C.dim,letterSpacing:1}}><span style={{color:dbReady?"#4ADE80":"#e6a53a"}}>{dbReady?"● Online":"● Connecting..."}</span></div>
            </div>
          )}
        </div>
      </header>

      {syncing?(
        <div style={{position:"fixed",top:"calc(56px + env(safe-area-inset-top,0px))",left:"50%",transform:"translateX(-50%)",zIndex:299,padding:"6px 16px",borderRadius:20,background:"rgba(236,122,28,0.15)",border:"1px solid rgba(236,122,28,0.3)",fontSize:11,color:"#ec7a1c",fontWeight:600,display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
          <span style={{display:"inline-block",animation:"spin 1s linear infinite"}}>⟳</span> Đang đồng bộ...
        </div>
      ):(
        <div style={{position:"fixed",top:"calc(56px + env(safe-area-inset-top,0px))",right:12,zIndex:299}}>
          <button onClick={loadFromDB} title="Tải lại dữ liệu từ server" style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:20,padding:"5px 12px",cursor:"pointer",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
            <Icon n="refresh" size={14} style={{marginRight:4}}/>Tải lại
          </button>
        </div>
      )}

      {notif&&(
        <div style={{position:"fixed",top:"calc(64px + env(safe-area-inset-top,0px))",left:"50%",transform:"translateX(-50%)",zIndex:300,padding:"10px 20px",borderRadius:20,color:"#fff",fontSize:13,fontWeight:600,boxShadow:"0 8px 24px rgba(0,0,0,0.5)",background:notif.type==="ok"?"#ec7a1c":"#EF4444",whiteSpace:"nowrap",maxWidth:"calc(100vw - 32px)",textAlign:"center",animation:"fadeIn 0.2s ease"}}>
          {notif.type==="ok"?"✓":"✗"} {notif.msg}
        </div>
      )}

      <main style={{maxWidth:900,margin:"0 auto",padding:"16px 12px calc(80px + env(safe-area-inset-bottom,0px))",position:"relative",zIndex:1}}>

        {tab==="dashboard"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{fontSize:20,fontWeight:800,fontFamily:"'Barlow Condensed',system-ui,sans-serif",letterSpacing:0.5,color:C.orange}}>Tổng quan CLB</div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,width:"100%"}}>
              {[
                {label:"Tổng VĐV",value:stats.total,icon:"players",color:"#ec7a1c"},
                {label:"Điểm TB",value:stats.avg,icon:"star",color:"#e6a53a"},
                {label:"Nam",value:stats.male,icon:"male",color:"#f4954a"},
                {label:"Nữ",value:stats.female,icon:"female",color:"#F9A8D4"},
              ].map((st,i)=>(
                <Card key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px"}}>
                  <div style={{width:40,height:40,borderRadius:8,background:"rgba(236,122,28,0.12)",border:"1px solid rgba(236,122,28,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon n={st.icon} size={20} color={st.color}/></div>
                  <div>
                    <div style={{fontSize:24,fontWeight:900,color:st.color,lineHeight:1}}>{st.value}</div>
                    <div style={{fontSize:11,color:C.muted,marginTop:2}}>{st.label}</div>
                  </div>
                </Card>
              ))}
            </div>

            <Card>
              <div style={{display:"flex",gap:0,marginBottom:14,borderRadius:10,overflow:"hidden",border:"1px solid "+C.border}}>
                {["male","female"].map(g=>(
                  <button key={g} onClick={()=>setRankGender(g)} style={{flex:1,padding:"9px",border:"none",cursor:"pointer",fontWeight:700,fontSize:13,background:rankGender===g?C.orange:"transparent",color:rankGender===g?"#fff":C.muted,transition:"all 0.2s"}}>
                    {g==="male"?"Top Nam":"Top Nữ"}
                  </button>
                ))}
              </div>
              {(rankGender==="male"?topMale:topFemale).map((p,i)=>(
                <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 4px",borderBottom:i<4?"1px solid rgba(236,122,28,0.08)":"none"}}>
                  <span style={{width:30,textAlign:"center",fontSize:i<3?18:13,flexShrink:0}}>{i===0?"1st":i===1?"2nd":i===2?"3rd":"#"+(i+1)}</span>
                  <span style={{flex:1,fontWeight:600,fontSize:14}}>{p.name}</span>
                  <TierChip tier={p.tier}/>
                  <BoomBadge boom={p.boom} tier={p.tier}/>
                </div>
              ))}
            </Card>

            <Card>
              <SectionTitle><Icon n="stats" size={14} color={C.orange} style={{marginRight:6}}/>Phân bố Tier</SectionTitle>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {TIERS.map(t=>{
                  const cnt=stats.tc[t]||0;
                  const pct=(cnt/stats.total)*100;
                  return(
                    <div key={t} style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{width:28,fontWeight:800,fontSize:12,color:TIER_COLORS[t],flexShrink:0}}>{t}</span>
                      <div style={{flex:1,height:5,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden"}}>
                        <div style={{width:pct+"%",height:"100%",background:TIER_COLORS[t],borderRadius:4}}/>
                      </div>
                      <span style={{width:20,fontSize:11,color:C.muted,textAlign:"right",flexShrink:0}}>{cnt}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {tab==="players"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontSize:20,fontWeight:800,fontFamily:"'Barlow Condensed',system-ui,sans-serif",letterSpacing:0.5,color:C.orange}}>VĐV ({filtered.length})</div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>{setShowRegModal(true);setRegSubmitted(false);setRegForm({name:"",email:"",pvna:"",gender:"male",phone:"",note:""}); }} style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.35)",color:"#f4954a",borderRadius:10,padding:"9px 12px",cursor:"pointer",fontSize:13,fontWeight:700}}><Icon n="register" size={14} style={{marginRight:4}}/>Đăng ký</button>
                {isAdmin&&can("canAddPlayers")&&(
                  <button onClick={()=>setShowAddModal(true)} style={{background:"linear-gradient(135deg,#ec7a1c,#f4954a)",border:"none",color:"#fff",borderRadius:10,padding:"9px 16px",cursor:"pointer",fontSize:13,fontWeight:700,boxShadow:"0 4px 12px rgba(236,122,28,0.35)"}}>+ Thêm</button>
                )}
              </div>
            </div>

            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <input placeholder=" Tìm tên..." value={search} onChange={e=>setSearch(e.target.value)}
                style={{flex:"1 1 140px",minWidth:0,background:"rgba(255,255,255,0.05)",border:"1px solid "+C.border,borderRadius:10,padding:"11px 12px",color:C.text,fontSize:16,outline:"none"}}/>
              <div style={{display:"flex",gap:8,flex:"0 0 auto"}}>
                <select value={filterGender} onChange={e=>setFilterGender(e.target.value)} style={{background:"rgba(255,255,255,0.07)",border:"1px solid "+C.border,borderRadius:10,padding:"11px 10px",color:C.text,fontSize:16,outline:"none",cursor:"pointer"}}>
                  <option value="all">Tất cả</option><option value="male">Nam</option><option value="female">Nữ</option>
                </select>
                <select value={filterTier} onChange={e=>setFilterTier(e.target.value)} style={{background:"rgba(255,255,255,0.07)",border:"1px solid "+C.border,borderRadius:10,padding:"11px 10px",color:C.text,fontSize:16,outline:"none",cursor:"pointer"}}>
                  <option value="all">Mọi Tier</option>
                  {TIERS.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {filtered.map((p,i)=>(
                <Card key={p.id} style={{padding:"12px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:32,height:32,borderRadius:10,background:"rgba(236,122,28,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <span style={{fontSize:14,color:p.gender==="male"?"#60A5FA":"#F9A8D4"}}>{p.gender==="male"?"Nam":"Nữ"}</span>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                        <span style={{fontWeight:700,fontSize:14,color:C.text}}>{p.name}</span>

                      </div>
                      {p.remark&&(
                        <div style={{fontSize:10,color:"#e6a53a",marginTop:3,fontStyle:"italic",display:"flex",alignItems:"center",gap:4}}>
                          <Icon n="register" size={12} color={C.muted}/><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.remark}</span>
                        </div>
                      )}
                      <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
                        {can("canEditPlayers")?(
                          <select value={p.tier} onChange={e=>handleTierChange(p,e.target.value)}
                            style={{background:"transparent",border:"1px solid "+TIER_COLORS[p.tier]+"66",borderRadius:8,padding:"4px 6px",fontSize:16,fontWeight:800,cursor:"pointer",outline:"none",color:TIER_COLORS[p.tier]}}>
                            {TIERS.map(t=><option key={t} value={t}>{t}</option>)}
                          </select>
                        ):(
                          <TierChip tier={p.tier}/>
                        )}
                        <BoomBadge boom={p.boom} tier={p.tier}/>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6,flexShrink:0}}>
                      <button onClick={()=>setPlayerHistoryView(p.name)}
                        style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:C.muted,borderRadius:10,padding:"8px 10px",cursor:"pointer",fontSize:14}} title="Lịch sử thi đấu">
                        <Icon n="stats" size={14}/>
                      </button>
                      {isAdmin&&can("canAdjustScore")&&(
                        <button onClick={()=>{setAdjModal(p);setAdjForm({type:"",value:0,note:""}); }}
                          style={{background:"rgba(236,122,28,0.12)",border:"1px solid rgba(236,122,28,0.35)",color:C.orange,borderRadius:10,padding:"8px 10px",cursor:"pointer",fontSize:14,fontWeight:700}} title="Điều chỉnh điểm">
                          <Icon n="bolt" size={14}/>
                        </button>
                      )}
                      {isAdmin&&can("canEditPlayers")&&(
                        <button onClick={()=>{setEditModal(p);setEditForm({name:p.name,tier:p.tier,gender:p.gender,remark:p.remark||"",phone:p.phone||""});}}
                          style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.35)",color:"#f4954a",borderRadius:10,padding:"8px 10px",cursor:"pointer",fontSize:14}} title="Sửa thông tin">
                          <Icon n="edit" size={14}/>
                        </button>
                      )}
                      {isAdmin&&can("canDeletePlayers")&&(
                        <button onClick={()=>setDeleteConfirm(p)}
                          style={{background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.35)",color:"#EF4444",borderRadius:10,padding:"8px 10px",cursor:"pointer",fontSize:14}} title="Xóa VĐV">
                          <Icon n="trash" size={14}/>
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

          </div>
        )}


        {tab==="ranking"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{fontSize:20,fontWeight:800,fontFamily:"'Barlow Condensed',system-ui,sans-serif",letterSpacing:0.5,color:C.orange}}>Xếp hạng</div>
            <div style={{display:"flex",gap:0,borderRadius:10,overflow:"hidden",border:"1px solid "+C.border}}>
              {["male","female"].map(g=>(
                <button key={g} onClick={()=>setRankGender(g)} style={{flex:1,padding:"10px",border:"none",cursor:"pointer",fontWeight:700,fontSize:13,background:rankGender===g?C.orange:"transparent",color:rankGender===g?"#fff":C.muted,transition:"all 0.2s"}}>
                  {g==="male"?"Nam":"Nữ"}
                </button>
              ))}
            </div>
            <Card>
              <SectionTitle><Icon n="ranking" size={14} color={C.orange} style={{marginRight:6}}/>Bảng xếp hạng {rankGender==="male"?"Nam":"Nữ"}</SectionTitle>
              {(rankGender==="male"?[...players.male]:[...players.female]).sort((a,b)=>b.boom-a.boom).map((p,i)=>(
                <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 4px",borderBottom:"1px solid rgba(236,122,28,0.07)"}}>
                  <span style={{width:32,textAlign:"center",fontSize:i<3?20:13,flexShrink:0}}>{i===0?"1st":i===1?"2nd":i===2?"3rd":"#"+(i+1)}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:14,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                    {p.remark&&<div style={{fontSize:10,color:"#e6a53a",fontStyle:"italic",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.remark}</div>}
                  </div>
                  <TierChip tier={p.tier}/>
                  <BoomBadge boom={p.boom} tier={p.tier}/>
                  <button onClick={()=>setPlayerHistoryView(p.name)} style={{background:"rgba(236,122,28,0.1)",border:"none",color:C.orange,borderRadius:8,padding:"5px 8px",cursor:"pointer",display:"flex",alignItems:"center"}}><Icon n="stats" size={14}/></button>
                </div>
              ))}
            </Card>

          </div>
        )}


        {tab==="history"&&(()=>{
          const allMatches=[];
          tournaments.forEach(tour=>{
            (tour.matches||[]).forEach(m=>{
              allMatches.push({...m,tourName:tour.name,tourDate:tour.date,tourStatus:tour.status});
            });
          });
          allMatches.sort((a,b)=>b.id-a.id);
          const totalMatches=allMatches.length;
          const totalTours=tournaments.length;
          const activeTours=tournaments.filter(t=>t.status==="active").length;
          const totalPlayers=allPlayers.length;
          return(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{fontSize:20,fontWeight:800,fontFamily:"'Barlow Condensed',system-ui,sans-serif",letterSpacing:0.5,color:C.orange}}>Lịch sử</div>
            {/* Summary stats */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[
                {icon:"ping2",label:"Tổng trận",v:totalMatches,c:C.orange},
                {icon:"tournament",label:"Giải đấu",v:totalTours,c:"#60A5FA"},
                {icon:"ping",label:"Đang diễn",v:activeTours,c:"#4ADE80"},
                {icon:"players",label:"VĐV",v:totalPlayers,c:"#F9A8D4"},
              ].map((s,i)=>(
                <Card key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px"}}>
                  <Icon n={s.icon} size={22} color={s.c}/>
                  <div>
                    <div style={{fontSize:22,fontWeight:900,color:s.c,lineHeight:1}}>{s.v}</div>
                    <div style={{fontSize:11,color:C.muted,marginTop:2}}>{s.label}</div>
                  </div>
                </Card>
              ))}
            </div>
            {/* Recent matches */}
            <Card>
              <SectionTitle><Icon n="ping2" size={14} color={C.orange} style={{marginRight:6}}/>Kết quả gần đây</SectionTitle>
              {!allMatches.length&&<div style={{textAlign:"center",color:C.dim,padding:20,fontSize:13}}>Chưa có trận đấu nào</div>}
              {allMatches.slice(0,30).map((m,i,arr)=>(
                <div key={m.id||i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i!==arr.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
                  <div style={{flexShrink:0,textAlign:"center",minWidth:28}}>
                    <div style={{fontSize:10,color:C.dim}}>R{m.round}</div>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                      <span style={{fontSize:13,fontWeight:700,color:m.score1>m.score2?"#4ADE80":C.text,maxWidth:"35%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(m.team1||[]).join(" & ")}</span>
                      <span style={{fontSize:14,fontWeight:900,color:C.text,background:"rgba(255,255,255,0.06)",borderRadius:6,padding:"1px 8px",flexShrink:0}}>{m.score1}–{m.score2}</span>
                      <span style={{fontSize:13,fontWeight:700,color:m.score2>m.score1?"#4ADE80":C.text,maxWidth:"35%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(m.team2||[]).join(" & ")}</span>
                    </div>
                    <div style={{fontSize:10,color:C.dim,marginTop:2}}>{m.tourName} · {m.tourDate}</div>
                  </div>
                </div>
              ))}
            </Card>
            {/* System activity log */}
            {!!history.length&&(
              <Card>
                <SectionTitle><Icon n="bolt" size={14} color={C.orange} style={{marginRight:6}}/>Nhật ký hệ thống</SectionTitle>
                {history.slice(0,20).map((h,i,arr)=>(
                  <div key={h.id||i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 0",borderBottom:i!==arr.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
                    <div style={{width:28,height:28,borderRadius:8,background:"rgba(236,122,28,0.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:12}}>
                      {h.action.includes("Thêm")?<Icon n="plus" size={13}/>:h.action.includes("Xóa")?<Icon n="trash" size={13}/>:h.action.includes("Sửa")?<Icon n="edit" size={13}/>:h.action.includes("Tier")?<Icon n="tag" size={13}/>:h.action.includes("điểm")?<Icon n="bolt" size={13}/>:<Icon n="register" size={13}/>}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:600,color:C.text}}>{h.action}: <span style={{color:C.orange}}>{h.player}</span></div>
                      {h.detail&&<div style={{fontSize:11,color:C.muted,marginTop:1}}>{h.detail}</div>}
                      <div style={{fontSize:10,color:C.dim,marginTop:2}}> {h.time}</div>
                    </div>
                  </div>
                ))}
              </Card>
            )}
          </div>
          );
        })()}

        {tab==="roles"&&isAdmin&&can("canManageRoles")&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{fontSize:20,fontWeight:800,fontFamily:"'Barlow Condensed',system-ui,sans-serif",letterSpacing:0.5,color:C.orange}}>Phân quyền</div>
            {ADMIN_CREDENTIALS.map((cred,i)=>{
              const rp=ROLE_PERMISSIONS[cred.role]||{};
              return(
                <Card key={i}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <div style={{width:36,height:36,borderRadius:10,background:"rgba(236,122,28,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{(rp.badge||"").split(" ")[0]}</div>
                    <div>
                      <div style={{fontWeight:800,fontSize:14,color:rp.color||C.text}}>{cred.label}</div>
                      <div style={{fontSize:11,color:C.dim}}>@{cred.username} · {rp.label}</div>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    {[["canAddPlayers","Thêm VĐV"],["canEditPlayers","Sửa VĐV"],["canDeletePlayers","Xóa VĐV"],["canAdjustScore","Điều chỉnh điểm"],["canCreateTournament","Tạo giải"],["canManageTournament","Quản lý giải"],["canApproveReg","Duyệt đăng ký"],["canResetData","Reset data"],["canManageRoles","Quản lý quyền"]].map(([pm,l])=>(
                      <div key={pm} style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:rp[pm]?C.text:C.dim}}>
                        <span style={{color:rp[pm]?"#4ADE80":"#EF4444",fontSize:12}}>{rp[pm]?"✓":"✗"}</span>{l}
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
        {tab==="roles"&&(!isAdmin||!can("canManageRoles"))&&(
          <div style={{textAlign:"center",padding:48,color:C.dim}}><Icon n="lock" size={16} color={C.dim} style={{marginRight:6}}/>Chỉ Admin mới có quyền xem</div>
        )}


        {tab==="tournament"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontSize:20,fontWeight:800,fontFamily:"'Barlow Condensed',system-ui,sans-serif",letterSpacing:0.5,color:C.orange}}>Giải đấu</div>
              {can("canCreateTournament")&&(
                <button onClick={()=>setShowTourModal(true)} style={{background:"linear-gradient(135deg,#ec7a1c,#f4954a)",border:"none",color:"#fff",borderRadius:10,padding:"9px 16px",cursor:"pointer",fontSize:13,fontWeight:700,boxShadow:"0 4px 12px rgba(236,122,28,0.35)"}}>+ Tạo giải</button>
              )}
            </div>
            {!tournaments.length&&<Card><div style={{textAlign:"center",color:C.dim,padding:24}}>Chưa có giải đấu nào</div></Card>}
            {tournaments.map(tour=>{
              const pendingCount=(tour.tourRegs||[]).filter(r=>r.status==="pending").length;
              const approvedCount=(tour.tourRegs||[]).filter(r=>r.status==="approved").length;
              return(
              <Card key={tour.id} style={{padding:0,overflow:"hidden"}}>
                {/* Cover image */}
                {tour.cover&&(
                  <div onClick={()=>setViewTour(tour)} style={{cursor:"pointer",position:"relative",height:130,overflow:"hidden",borderRadius:"6px 6px 0 0"}}>
                    <img src={tour.cover} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,0.1) 0%,rgba(28,28,22,0.85) 100%)"}}/>
                    <div style={{position:"absolute",bottom:10,left:14,right:14}}>
                      <div style={{fontWeight:900,fontSize:16,color:"#fff",textShadow:"0 1px 4px rgba(0,0,0,0.6)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tour.name}</div>
                      <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,fontWeight:700,background:tour.status==="active"?"rgba(74,222,128,0.85)":"rgba(107,114,128,0.85)",color:"#fff",display:"inline-block",marginTop:3}}>{tour.status==="active"?"● Đang diễn":"○ Kết thúc"}</span>
                    </div>
                  </div>
                )}
                <div style={{padding:14}}>
                <div onClick={()=>setViewTour(tour)} style={{cursor:"pointer"}}>
                  {!tour.cover&&<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <div style={{fontWeight:800,fontSize:15,color:C.text,flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tour.name}</div>
                    <span style={{fontSize:10,padding:"3px 8px",borderRadius:10,fontWeight:700,background:tour.status==="active"?"rgba(74,222,128,0.15)":"rgba(107,114,128,0.15)",color:tour.status==="active"?"#4ADE80":"#6B7280",flexShrink:0,marginLeft:8}}>{tour.status==="active"?"● Đang diễn":"○ Kết thúc"}</span>
                  </div>}
                  <div style={{fontSize:11,color:C.dim,display:"flex",gap:10,flexWrap:"wrap",marginBottom:6}}>
                    <span style={{display:"flex",alignItems:"center",gap:4}}><Icon n="calendar" size={12} color={C.muted}/>{tour.date}</span>
                    <span>{tour.format==="single"?"Đơn":tour.format==="double"?"Đôi":"Hỗn hợp"}</span>
                    <span style={{display:"flex",alignItems:"center",gap:4}}><Icon n="ping2" size={12} color={C.muted}/>{(tour.matches||[]).length} trận</span>
                    <span style={{color:"#4ADE80",fontWeight:600}}>✓ {approvedCount} VĐV</span>
                    {pendingCount&&can("canApproveTourReg")?<span style={{color:"#FBbF24",fontWeight:700}}>{pendingCount} chờ duyệt</span>:null}
                  </div>
                  {tour.note&&<div style={{fontSize:11,color:C.muted,fontStyle:"italic",marginBottom:4}}>{tour.note}</div>}
                </div>
                <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
                  {tour.status==="active"&&(
                    <button onClick={e=>{e.stopPropagation();setShowTourRegForm(tour);setTourRegForm({tourId:String(tour.id),playerName:"",contact:"",content:tour.format==="single"?"single":"double",partner:"",note:""}); setTourRegSubmitted(false);}} style={{flex:1,background:"linear-gradient(135deg,#ec7a1c,#f4954a)",border:"none",color:"#fff",borderRadius:8,padding:"8px",cursor:"pointer",fontSize:12,fontWeight:700}}>
                      <Icon n="register" size={13} style={{marginRight:4}}/>Đăng ký
                    </button>
                  )}
                  {tour.status==="active"&&(
                    <button onClick={e=>{e.stopPropagation();const url=getTourShareUrl(tour.id);if(navigator.share){navigator.share({title:"Đăng ký: "+tour.name,text:"Đăng ký tham gia giải Pickleball "+tour.name+" ngày "+tour.date,url}).catch(()=>{});}else{navigator.clipboard.writeText(url).then(()=>showNotif("Đã sao chép link đăng ký!")).catch(()=>showNotif("Không thể sao chép","err"));}}} style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.25)",color:"#60A5FA",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:4}}>
                      <Icon n="fb" size={13}/>Share
                    </button>
                  )}
                  {can("canManageTournament")&&(
                    <>
                      <button onClick={e=>{e.stopPropagation();setActiveTour(tour);setViewTour(tour);}} style={{background:"rgba(236,122,28,0.12)",border:"1px solid rgba(236,122,28,0.35)",color:C.orange,borderRadius:8,padding:"8px 10px",cursor:"pointer",fontSize:12,fontWeight:700}}><Icon n="settings" size={14}/></button>
                      <button onClick={e=>{e.stopPropagation();setEditTourModal({tour,form:{name:tour.name,date:tour.date,format:tour.format,rounds:String(tour.rounds||1),note:tour.note||"",pin:tour.pin||"",bestOf:String(tour.bestOf||3)}});}} style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.35)",color:"#f4954a",borderRadius:8,padding:"8px 10px",cursor:"pointer",fontSize:12}}><Icon n="edit" size={14}/></button>
                      {tour.status==="active"&&<button onClick={e=>{e.stopPropagation();if(window.confirm("Kết thúc giải "+tour.name+"?"))handleEndTour(tour);}} style={{background:"rgba(251,191,36,0.12)",border:"1px solid rgba(251,191,36,0.35)",color:"#FBbF24",borderRadius:8,padding:"8px 10px",cursor:"pointer",fontSize:12}}><Icon n="check" size={14}/></button>}
                      <button onClick={e=>{e.stopPropagation();if(window.confirm("Xóa giải "+tour.name+"?"))handleDeleteTour(tour);}} style={{background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.35)",color:"#EF4444",borderRadius:8,padding:"8px 10px",cursor:"pointer",fontSize:12}}><Icon n="trash" size={14}/></button>
                    </>
                  )}
                </div>
                </div>
              </Card>
              );
            })}
            {viewTour&&(
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"flex-end",zIndex:200,animation:"fadeIn 0.2s ease"}}>
                <div style={{background:"linear-gradient(160deg,#28281f 0%,#333329 100%)",borderRadius:"22px 22px 0 0",width:"100%",maxHeight:"93vh",display:"flex",flexDirection:"column",border:"1px solid "+C.border,boxShadow:"0 -8px 40px rgba(0,0,0,0.6)"}}>
                  {/* Drag handle */}
                  <div style={{width:44,height:5,background:"rgba(255,255,255,0.18)",borderRadius:4,margin:"12px auto 0",flexShrink:0}}/>
                  {/* Cover image inside modal */}
                  {viewTour.cover&&(
                    <div style={{position:"relative",height:150,margin:"10px 0 0",overflow:"hidden",flexShrink:0}}>
                      <img src={viewTour.cover} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,0.05) 0%,rgba(28,28,22,0.92) 100%)"}}/>
                      <div style={{position:"absolute",bottom:12,left:18,right:52}}>
                        <div style={{fontWeight:900,fontSize:18,color:"#fff",textShadow:"0 1px 6px rgba(0,0,0,0.7)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{viewTour.name}</div>
                        <div style={{fontSize:11,color:"rgba(255,255,255,0.75)",display:"flex",gap:8,marginTop:3}}>
                          <span style={{display:"flex",alignItems:"center",gap:3}}><Icon n="calendar" size={11}/>{viewTour.date}</span>
                          <span>{viewTour.format==="single"?"Đơn":viewTour.format==="double"?"Đôi":"Hỗn hợp"}</span>
                          <span style={{color:viewTour.status==="active"?"#4ADE80":"#aaa",fontWeight:700}}>{viewTour.status==="active"?"● Đang diễn":"○ Kết thúc"}</span>
                        </div>
                      </div>
                      <button onClick={()=>{setViewTour(null);setViewTourTab("groups");setKnockoutBracket(null);}} style={{position:"absolute",top:10,right:14,background:"rgba(0,0,0,0.5)",border:"none",color:"#fff",borderRadius:10,width:34,height:34,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
                        <Icon n="x" size={15}/>
                      </button>
                    </div>
                  )}
                  {/* Header */}
                  <div style={{padding:"12px 18px 0",flexShrink:0}}>
                    {!viewTour.cover&&<div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:8}}>
                      <div style={{minWidth:0}}>
                        <div style={{fontWeight:900,fontSize:17,color:C.orange,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{viewTour.name}</div>
                        <div style={{fontSize:11,color:C.muted,display:"flex",gap:8,flexWrap:"wrap",marginTop:3}}>
                          <span style={{display:"flex",alignItems:"center",gap:3}}><Icon n="calendar" size={11}/>{viewTour.date}</span>
                          <span>{viewTour.format==="single"?"Đơn":viewTour.format==="double"?"Đôi":"Hỗn hợp"}</span>
                          <span style={{color:viewTour.status==="active"?"#4ADE80":"#6B7280",fontWeight:700}}>{viewTour.status==="active"?"● Đang diễn":"○ Kết thúc"}</span>
                        </div>
                      </div>
                      <button onClick={()=>{setViewTour(null);setViewTourTab("groups");setKnockoutBracket(null);}} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",color:C.muted,borderRadius:10,width:36,height:36,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <Icon n="x" size={16}/>
                      </button>
                    </div>}
                    {/* Admin action buttons */}
                    {(can("canManageTournament")||can("canApproveTourReg"))&&(
                      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                        {viewTour.status==="active"&&(
                          <button onClick={()=>{const url=getTourShareUrl(viewTour.id);if(navigator.share){navigator.share({title:"Đăng ký: "+viewTour.name,text:"Đăng ký tham gia giải Pickleball "+viewTour.name+" ngày "+viewTour.date,url}).catch(()=>{});}else{navigator.clipboard.writeText(url).then(()=>showNotif("Đã sao chép link đăng ký!")).catch(()=>showNotif("Không thể sao chép","err"));}}} style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.25)",color:"#60A5FA",borderRadius:8,padding:"7px 12px",cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:4}}>
                            <Icon n="fb" size={12}/>Share link
                          </button>
                        )}
                        {can("canManageTournament")&&viewTour.status==="active"&&<button onClick={()=>setShowMatchModal(true)} style={{background:"linear-gradient(135deg,#ec7a1c,#f4954a)",border:"none",color:"#fff",borderRadius:8,padding:"7px 12px",cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:4}}><Icon n="plus" size={12}/>Thêm trận</button>}
                        {can("canManageTournament")&&<button onClick={()=>openGroupDraw(viewTour)} style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.3)",color:"#f4954a",borderRadius:8,padding:"7px 12px",cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:4}}><Icon n="target" size={12}/>Chia bảng</button>}
                        {(can("canManageTournament")||can("canApproveTourReg"))&&<button onClick={()=>setShowTourRegAdmin(viewTour)} style={{position:"relative",background:"rgba(251,191,36,0.12)",border:"1px solid rgba(251,191,36,0.3)",color:"#FBbF24",borderRadius:8,padding:"7px 12px",cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:4}}>
                          <Icon n="history" size={12}/>DS Đăng ký
                          {(viewTour.tourRegs||[]).filter(r=>r.status==="pending").length?<span style={{position:"absolute",top:-5,right:-5,background:"#EF4444",color:"#fff",borderRadius:20,fontSize:9,fontWeight:900,padding:"1px 5px"}}>{(viewTour.tourRegs||[]).filter(r=>r.status==="pending").length}</span>:null}
                        </button>}
                        {can("canManageTournament")&&viewTour.status==="active"&&<button onClick={async()=>{if(window.confirm("Kết thúc giải?"))await handleEndTour(viewTour);}} style={{background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.3)",color:"#EF4444",borderRadius:8,padding:"7px 12px",cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:4}}><Icon n="check" size={12}/>Kết thúc</button>}
                        {can("canManageTournament")&&<button onClick={()=>{setEditTourModal({tour:viewTour,form:{name:viewTour.name,date:viewTour.date,format:viewTour.format,rounds:String(viewTour.rounds||1),note:viewTour.note||"",pin:viewTour.pin||"",bestOf:String(viewTour.bestOf||3)}});}} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:8,padding:"7px 10px",cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",gap:4}}><Icon n="edit" size={12}/>Sửa</button>}
                      </div>
                    )}
                    {/* Tab navigation */}
                    {!!(viewTour.groups||[]).length&&(
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4,marginBottom:0}}>
                        {[
                          {key:"groups",label:"Bảng đấu",icon:"target"},
                          {key:"schedule",label:"Lịch đấu",icon:"calendar"},
                          {key:"knockout",label:"Knockout",icon:"trophy"},
                        ].map(tb=>(
                          <button key={tb.key} onClick={()=>{setViewTourTab(tb.key);if(tb.key==="knockout"&&!knockoutBracket)setKnockoutBracket(generateKnockoutFromGroups(viewTour));}}
                            style={{padding:"8px 4px",borderRadius:"10px 10px 0 0",border:"none",borderBottom:viewTourTab===tb.key?"2px solid "+C.orange:"2px solid transparent",background:viewTourTab===tb.key?"rgba(236,122,28,0.1)":"transparent",color:viewTourTab===tb.key?C.orange:C.muted,cursor:"pointer",fontWeight:700,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",gap:5,transition:"all 0.15s"}}>
                            <Icon n={tb.icon} size={13}/>{tb.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Scrollable body */}
                  <div style={{overflowY:"auto",flex:1,padding:"16px 18px 24px",WebkitOverflowScrolling:"touch"}}>

                  {/* ══ TAB: BẢNG ĐẤU ══ */}
                  {(viewTourTab==="groups"||(viewTour.groups||[]).length===0)&&(()=>{
                    const scheduled=(viewTour.matches||[]).filter(m=>m.group);
                    const groupNames=[...new Set(scheduled.map(m=>m.group))];
                    return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
                      {!(viewTour.groups||[]).length&&(
                        <div style={{textAlign:"center",color:C.dim,padding:"32px 0"}}>
                          <Icon n="target" size={28} color={C.dim} style={{marginBottom:8}}/>
                          <div style={{fontSize:13}}>Chưa chia bảng</div>
                          {can("canManageTournament")&&<button onClick={()=>openGroupDraw(viewTour)} style={{marginTop:12,background:"linear-gradient(135deg,#ec7a1c,#f4954a)",border:"none",color:"#fff",borderRadius:10,padding:"10px 20px",cursor:"pointer",fontSize:13,fontWeight:700}}>Chia bảng ngay</button>}
                        </div>
                      )}
                      {(viewTour.groups||[]).map((g,gi)=>{
                        const gMatches=scheduled.filter(m=>m.group===g.name&&m.status==="done");
                        const playerNames=g.players||[];
                        const standings=playerNames.map(name=>{
                          const wins=gMatches.filter(m=>(m.p1===name&&m.score1>m.score2)||(m.p2===name&&m.score2>m.score1)).length;
                          const losses=gMatches.filter(m=>(m.p1===name&&m.score1<m.score2)||(m.p2===name&&m.score2<m.score1)).length;
                          const played=wins+losses;
                          const ptsFor=gMatches.reduce((s,m)=>s+(m.p1===name?(m.score1||0):(m.p2===name?(m.score2||0):0)),0);
                          const ptsAgainst=gMatches.reduce((s,m)=>s+(m.p1===name?(m.score2||0):(m.p2===name?(m.score1||0):0)),0);
                          return{name,wins,losses,played,ptsFor,ptsAgainst,diff:ptsFor-ptsAgainst};
                        }).sort((a,b)=>b.wins-a.wins||b.diff-a.diff);
                        return(
                        <div key={gi} style={{background:"rgba(255,255,255,0.025)",borderRadius:14,border:"1px solid rgba(236,122,28,0.18)",overflow:"hidden"}}>
                          {/* Group header */}
                          <div style={{background:"rgba(236,122,28,0.12)",borderBottom:"1px solid rgba(236,122,28,0.18)",padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                            <span style={{fontWeight:900,fontSize:14,color:C.orange,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:0.5}}>{g.name}</span>
                            <span style={{fontSize:10,color:C.muted}}>{playerNames.length} VĐV · {gMatches.length}/{scheduled.filter(m=>m.group===g.name).length} trận</span>
                          </div>
                          {/* Standings table */}
                          <div style={{overflowX:"auto"}}>
                            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                              <thead>
                                <tr style={{background:"rgba(255,255,255,0.03)"}}>
                                  <th style={{padding:"7px 14px",textAlign:"left",color:C.dim,fontWeight:700,fontSize:10,letterSpacing:0.5,whiteSpace:"nowrap"}}>#</th>
                                  <th style={{padding:"7px 8px",textAlign:"left",color:C.dim,fontWeight:700,fontSize:10,letterSpacing:0.5}}>VĐV</th>
                                  <th style={{padding:"7px 8px",textAlign:"center",color:C.dim,fontWeight:700,fontSize:10}}>T</th>
                                  <th style={{padding:"7px 8px",textAlign:"center",color:C.dim,fontWeight:700,fontSize:10}}>B</th>
                                  <th style={{padding:"7px 8px",textAlign:"center",color:C.dim,fontWeight:700,fontSize:10}}>ĐV</th>
                                  <th style={{padding:"7px 8px",textAlign:"center",color:C.dim,fontWeight:700,fontSize:10}}>ĐT</th>
                                  <th style={{padding:"7px 12px",textAlign:"center",color:C.dim,fontWeight:700,fontSize:10}}>+/-</th>
                                </tr>
                              </thead>
                              <tbody>
                                {standings.map((s,si)=>(
                                  <tr key={s.name} style={{borderTop:"1px solid rgba(255,255,255,0.04)",background:si===0?"rgba(236,122,28,0.06)":si===1?"rgba(236,122,28,0.03)":"transparent"}}>
                                    <td style={{padding:"9px 14px",textAlign:"left"}}>
                                      <span style={{fontWeight:900,fontSize:13,color:si===0?C.orange:si===1?"#d4b870":C.dim}}>{si+1}</span>
                                    </td>
                                    <td style={{padding:"9px 8px",maxWidth:120}}>
                                      <div style={{fontWeight:si<2?700:500,color:si===0?C.text:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:12}}>{s.name}</div>
                                      {si<2&&<div style={{fontSize:9,color:si===0?"#4ADE80":"#60A5FA",fontWeight:700,marginTop:1}}>{si===0?"Nhất bảng":"Nhì bảng"}</div>}
                                    </td>
                                    <td style={{padding:"9px 8px",textAlign:"center",fontWeight:700,color:"#4ADE80"}}>{s.wins}</td>
                                    <td style={{padding:"9px 8px",textAlign:"center",color:"#EF4444"}}>{s.losses}</td>
                                    <td style={{padding:"9px 8px",textAlign:"center",color:C.muted}}>{s.ptsFor}</td>
                                    <td style={{padding:"9px 8px",textAlign:"center",color:C.muted}}>{s.ptsAgainst}</td>
                                    <td style={{padding:"9px 12px",textAlign:"center",fontWeight:700,color:s.diff>0?C.orange:s.diff<0?"#EF4444":C.dim}}>{s.diff>0?"+":""}{s.diff}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )})}
                      {can("canManageTournament")&&!!(viewTour.groups||[]).length&&(
                        <button onClick={()=>handleDeleteGroups(viewTour)} style={{alignSelf:"flex-start",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",color:"#EF4444",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
                          <Icon n="trash" size={13}/>Xóa bảng
                        </button>
                      )}
                    </div>);
                  })()}

                  {/* ══ TAB: LỊCH THI ĐẤU ══ */}
                  {viewTourTab==="schedule"&&!!(viewTour.groups||[]).length&&(()=>{
                    const scheduled=(viewTour.matches||[]).filter(m=>m.group);
                    const legacy=(viewTour.matches||[]).filter(m=>!m.group);
                    const groupNames=[...new Set(scheduled.map(m=>m.group))];
                    return(<div style={{display:"flex",flexDirection:"column",gap:12}}>
                      {can("canManageTournament")&&(
                        <button onClick={()=>{
                          const existing=scheduled.length;
                          if(existing>0&&!window.confirm("Đã có "+existing+" trận. Tạo thêm?")) return;
                          handleAutoGenerateMatches(viewTour);
                        }} style={{background:"linear-gradient(135deg,#ec7a1c,#f4954a)",border:"none",color:"#fff",borderRadius:10,padding:"11px 16px",cursor:"pointer",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6,alignSelf:"flex-start"}}>
                          <Icon n="plus" size={14}/>Tạo lịch thi đấu round-robin
                        </button>
                      )}
                      {!scheduled.length&&<div style={{textAlign:"center",color:C.dim,padding:"24px 0",fontSize:13}}>Chưa có lịch thi đấu</div>}
                      {groupNames.map(gName=>{
                        const gMatches=scheduled.filter(m=>m.group===gName);
                        const done=gMatches.filter(m=>m.status==="done").length;
                        return(
                        <div key={gName} style={{background:"rgba(255,255,255,0.025)",borderRadius:14,border:"1px solid rgba(236,122,28,0.15)",overflow:"hidden"}}>
                          <div style={{background:"rgba(236,122,28,0.1)",borderBottom:"1px solid rgba(236,122,28,0.15)",padding:"9px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                            <span style={{fontWeight:900,fontSize:13,color:C.orange,fontFamily:"'Barlow Condensed',sans-serif"}}>{gName}</span>
                            <span style={{fontSize:10,color:C.muted}}>{done}/{gMatches.length} hoàn thành</span>
                          </div>
                          {gMatches.map((m,mi)=>{
                            const isEditing=editingMatchScore?.matchId===m.id;
                            const isDone=m.status==="done";
                            return(
                            <div key={m.id} style={{padding:"10px 14px",borderBottom:mi!==gMatches.length-1?"1px solid rgba(255,255,255,0.04)":"none",background:isEditing?"rgba(236,122,28,0.05)":"transparent"}}>
                              <div style={{display:"flex",alignItems:"center",gap:6}}>
                                <span style={{flex:1,fontSize:12,fontWeight:isDone&&m.score1>m.score2?700:500,color:isDone&&m.score1>m.score2?C.orange:C.text,textAlign:"right",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.p1}</span>
                                {isDone?(
                                  <span style={{fontWeight:900,fontSize:14,flexShrink:0,minWidth:56,textAlign:"center",padding:"4px 8px",background:"rgba(255,255,255,0.07)",borderRadius:8,color:C.text}}>{m.score1} – {m.score2}</span>
                                ):(
                                  <span style={{fontSize:11,color:C.dim,flexShrink:0,padding:"4px 10px",background:"rgba(255,255,255,0.04)",borderRadius:8,minWidth:56,textAlign:"center"}}>vs</span>
                                )}
                                <span style={{flex:1,fontSize:12,fontWeight:isDone&&m.score2>m.score1?700:500,color:isDone&&m.score2>m.score1?C.orange:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.p2}</span>
                                {can("canManageTournament")&&!isEditing&&(
                                  <div style={{display:"flex",gap:4,flexShrink:0}}>
                                    <button onClick={()=>setEditingMatchScore({matchId:m.id,s1:isDone?String(m.score1):"",s2:isDone?String(m.score2):""})} style={{background:"rgba(236,122,28,0.12)",border:"none",color:C.orange,borderRadius:6,padding:"5px 8px",cursor:"pointer",display:"flex",alignItems:"center",gap:3,fontSize:11,fontWeight:700}}>
                                      <Icon n="edit" size={11}/>{isDone?"Sửa":"Nhập"}
                                    </button>
                                    <button onClick={()=>{if(window.confirm("Xóa trận?"))handleDeleteScheduledMatch(viewTour,m.id);}} style={{background:"rgba(239,68,68,0.08)",border:"none",color:"#EF4444",borderRadius:6,padding:"5px 7px",cursor:"pointer"}}><Icon n="trash" size={11}/></button>
                                  </div>
                                )}
                              </div>
                              {isEditing&&(
                                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:8}}>
                                  <input value={editingMatchScore.s1} onChange={e=>setEditingMatchScore(v=>({...v,s1:e.target.value}))} placeholder="0" inputMode="numeric" style={{...MS,flex:1,textAlign:"center",fontSize:20,fontWeight:900,padding:"8px 4px"}} maxLength={2}/>
                                  <span style={{color:C.dim,fontWeight:700}}>–</span>
                                  <input value={editingMatchScore.s2} onChange={e=>setEditingMatchScore(v=>({...v,s2:e.target.value}))} placeholder="0" inputMode="numeric" style={{...MS,flex:1,textAlign:"center",fontSize:20,fontWeight:900,padding:"8px 4px"}} maxLength={2}/>
                                  <button onClick={()=>{const s1=parseInt(editingMatchScore.s1),s2=parseInt(editingMatchScore.s2);if(isNaN(s1)||isNaN(s2)){showNotif("Nhập điểm hợp lệ","err");return;}handleUpdateMatchScore(viewTour,m.id,s1,s2);setEditingMatchScore(null);}} style={{background:"linear-gradient(135deg,#ec7a1c,#f4954a)",border:"none",color:"#fff",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:4}}><Icon n="check" size={13}/>Lưu</button>
                                  <button onClick={()=>setEditingMatchScore(null)} style={{background:"rgba(255,255,255,0.06)",border:"none",color:C.muted,borderRadius:8,padding:"8px 10px",cursor:"pointer"}}><Icon n="x" size={13}/></button>
                                </div>
                              )}
                            </div>
                          )})}
                        </div>
                      )})}
                      {!!legacy.length&&(
                        <div style={{background:"rgba(255,255,255,0.025)",borderRadius:14,border:"1px solid "+C.border,overflow:"hidden"}}>
                          <div style={{padding:"9px 14px",borderBottom:"1px solid rgba(255,255,255,0.05)",fontSize:12,color:C.muted,fontWeight:700}}>Kết quả khác</div>
                          {legacy.map((m,i)=>(
                            <div key={m.id||i} style={{padding:"10px 14px",borderBottom:i!==legacy.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
                              <div style={{display:"flex",alignItems:"center",gap:8}}>
                                <span style={{fontSize:10,color:C.dim}}>R{m.round}</span>
                                <span style={{flex:1,fontSize:12,fontWeight:600,color:m.score1>m.score2?C.orange:C.text,textAlign:"right"}}>{(m.team1||[]).join(" & ")}</span>
                                <span style={{fontWeight:900,fontSize:13,padding:"3px 8px",background:"rgba(255,255,255,0.06)",borderRadius:6,flexShrink:0,color:C.text}}>{m.score1} – {m.score2}</span>
                                <span style={{flex:1,fontSize:12,fontWeight:600,color:m.score2>m.score1?C.orange:C.text}}>{(m.team2||[]).join(" & ")}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>);
                  })()}

                  {/* ══ TAB: KNOCKOUT ══ */}
                  {viewTourTab==="knockout"&&!!(viewTour.groups||[]).length&&(()=>{
                    const kb = knockoutBracket || generateKnockoutFromGroups(viewTour);
                    if(!kb) return <div style={{textAlign:"center",color:C.dim,padding:"32px 0",fontSize:13}}>Cần chia bảng và có kết quả trước</div>;

                    const KOMatch = ({match,roundLabel,onScore}) => {
                      const [editing,setEditing] = useState(false);
                      const [s1,setS1] = useState(match.done?String(match.score1):"");
                      const [s2,setS2] = useState(match.done?String(match.score2):"");
                      const isTBD = match.p1?.startsWith("W ")||match.p1?.startsWith("L ")||match.p2?.startsWith("W ")||match.p2?.startsWith("L ");
                      return(
                        <div style={{background:"rgba(255,255,255,0.04)",borderRadius:12,border:"1px solid "+(match.done?"rgba(236,122,28,0.35)":"rgba(255,255,255,0.08)"),overflow:"hidden",minWidth:0}}>
                          {/* Round label */}
                          <div style={{padding:"5px 12px",background:match.done?"rgba(236,122,28,0.1)":"rgba(255,255,255,0.03)",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                            <span style={{fontSize:10,fontWeight:800,color:match.done?C.orange:C.dim,letterSpacing:0.8,fontFamily:"'Barlow Condensed',sans-serif"}}>{roundLabel}</span>
                            {match.done&&<Icon n="check" size={11} color="#4ADE80"/>}
                          </div>
                          {/* Players */}
                          {[{name:match.p1,score:match.score1,won:match.done&&match.score1>match.score2},
                            {name:match.p2,score:match.score2,won:match.done&&match.score2>match.score1}].map((p,pi)=>(
                            <div key={pi} style={{padding:"9px 12px",display:"flex",alignItems:"center",gap:8,borderBottom:pi===0?"1px solid rgba(255,255,255,0.05)":"none",background:p.won?"rgba(236,122,28,0.06)":"transparent"}}>
                              <span style={{flex:1,fontSize:12,fontWeight:p.won?800:500,color:p.won?C.orange:isTBD?"#666":C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontStyle:isTBD?"italic":"normal"}}>{p.name||"TBD"}</span>
                              {match.done&&<span style={{fontSize:14,fontWeight:900,color:p.won?C.orange:C.muted,minWidth:20,textAlign:"center"}}>{p.score}</span>}
                            </div>
                          ))}
                          {/* Score input */}
                          {can("canManageTournament")&&!isTBD&&(
                            <div style={{padding:"6px 10px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
                              {!editing?(
                                <button onClick={()=>{setEditing(true);setS1(match.done?String(match.score1):"");setS2(match.done?String(match.score2):"");}} style={{width:"100%",background:"rgba(236,122,28,0.1)",border:"none",color:C.orange,borderRadius:7,padding:"5px",cursor:"pointer",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                                  <Icon n="edit" size={11}/>{match.done?"Sửa kết quả":"Nhập kết quả"}
                                </button>
                              ):(
                                <div style={{display:"flex",gap:4,alignItems:"center"}}>
                                  <input value={s1} onChange={e=>setS1(e.target.value)} placeholder="0" inputMode="numeric" style={{...MS,flex:1,textAlign:"center",fontSize:16,fontWeight:900,padding:"5px 2px"}} maxLength={2}/>
                                  <span style={{color:C.dim,fontSize:12}}>–</span>
                                  <input value={s2} onChange={e=>setS2(e.target.value)} placeholder="0" inputMode="numeric" style={{...MS,flex:1,textAlign:"center",fontSize:16,fontWeight:900,padding:"5px 2px"}} maxLength={2}/>
                                  <button onClick={()=>{const n1=parseInt(s1),n2=parseInt(s2);if(isNaN(n1)||isNaN(n2))return;onScore(match.id,n1,n2,kb);setEditing(false);}} style={{background:"linear-gradient(135deg,#ec7a1c,#f4954a)",border:"none",color:"#fff",borderRadius:7,padding:"5px 10px",cursor:"pointer",fontWeight:700,fontSize:11}}><Icon n="check" size={11}/></button>
                                  <button onClick={()=>setEditing(false)} style={{background:"rgba(255,255,255,0.06)",border:"none",color:C.muted,borderRadius:7,padding:"5px 8px",cursor:"pointer"}}><Icon n="x" size={11}/></button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    };

                    const onScore = (id,s1,s2,bracket) => handleSaveKnockoutScore(viewTour,id,s1,s2,bracket);
                    const roundLabels = {QF:"Tứ kết",SF:"Bán kết",F:"Chung kết",["3rd"]:"Tranh hạng 3"};

                    return(
                      <div style={{display:"flex",flexDirection:"column",gap:16}}>
                        {/* Regenerate button */}
                        <div style={{display:"flex",gap:8,alignItems:"center"}}>
                          <button onClick={()=>setKnockoutBracket(generateKnockoutFromGroups(viewTour))} style={{background:"rgba(236,122,28,0.1)",border:"1px solid rgba(236,122,28,0.25)",color:C.orange,borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:5}}><Icon n="refresh" size={12}/>Cập nhật bracket</button>
                          <span style={{fontSize:10,color:C.dim}}>Dựa trên kết quả bảng đấu</span>
                        </div>

                        {/* Standings summary */}
                        <div style={{background:"rgba(255,255,255,0.025)",borderRadius:12,border:"1px solid rgba(255,255,255,0.07)",padding:"10px 14px"}}>
                          <div style={{fontSize:10,fontWeight:800,color:C.muted,letterSpacing:0.8,marginBottom:8,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase"}}>VĐV vào vòng knockout</div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                            {kb.groupStandings.flatMap(g=>g.standings.slice(0,2).map((s,si)=>(
                              <div key={g.name+s.name} style={{display:"flex",alignItems:"center",gap:5,background:si===0?"rgba(236,122,28,0.1)":"rgba(96,165,250,0.1)",borderRadius:8,padding:"5px 10px",border:"1px solid "+(si===0?"rgba(236,122,28,0.25)":"rgba(96,165,250,0.2)")}}>
                                <span style={{fontSize:9,fontWeight:800,color:si===0?C.orange:"#60A5FA"}}>{g.name} {si===0?"1st":"2nd"}</span>
                                <span style={{fontSize:12,fontWeight:700,color:C.text}}>{s.name}</span>
                                <span style={{fontSize:10,color:si===0?"#4ADE80":"#60A5FA"}}>{s.wins}T</span>
                              </div>
                            )))}
                          </div>
                        </div>

                        {/* QF bracket */}
                        {kb.qf.length>0&&(
                          <div>
                            <div style={{fontSize:11,fontWeight:800,color:C.muted,letterSpacing:0.8,marginBottom:8,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",display:"flex",alignItems:"center",gap:6}}><Icon n="tournament" size={12} color={C.muted}/>Tứ kết</div>
                            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
                              {kb.qf.map((m,i)=><KOMatch key={m.id} match={m} roundLabel={"QF "+(i+1)} onScore={onScore}/>)}
                            </div>
                          </div>
                        )}

                        {/* SF bracket */}
                        {kb.sf.length>0&&(
                          <div>
                            <div style={{fontSize:11,fontWeight:800,color:C.muted,letterSpacing:0.8,marginBottom:8,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",display:"flex",alignItems:"center",gap:6}}><Icon n="ranking" size={12} color={C.muted}/>Bán kết</div>
                            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
                              {kb.sf.map((m,i)=><KOMatch key={m.id} match={m} roundLabel={"SF "+(i+1)} onScore={onScore}/>)}
                            </div>
                          </div>
                        )}

                        {/* Final + 3rd place */}
                        {kb.final.length>0&&(
                          <div>
                            <div style={{fontSize:11,fontWeight:800,color:C.muted,letterSpacing:0.8,marginBottom:8,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",display:"flex",alignItems:"center",gap:6}}><Icon n="trophy" size={12} color={"#e6a53a"}/>Chung kết</div>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                              {kb.final.map((m,i)=><KOMatch key={m.id} match={m} roundLabel={i===0?"🏆 Chung kết":"Tranh hạng 3"} onScore={onScore}/>)}
                            </div>
                          </div>
                        )}

                        {/* Winner podium */}
                        {kb.final[0]?.done&&(
                          <div style={{background:"linear-gradient(135deg,rgba(236,122,28,0.15),rgba(230,165,58,0.1))",borderRadius:16,border:"1px solid rgba(236,122,28,0.3)",padding:"20px 16px",textAlign:"center"}}>
                            <Icon n="trophy" size={32} color="#e6a53a" style={{marginBottom:8}}/>
                            <div style={{fontSize:11,color:C.muted,marginBottom:4,letterSpacing:1,textTransform:"uppercase",fontWeight:700}}>Vô địch</div>
                            <div style={{fontSize:22,fontWeight:900,color:C.orange,fontFamily:"'Barlow Condensed',sans-serif"}}>
                              {kb.final[0].score1>kb.final[0].score2?kb.final[0].p1:kb.final[0].p2}
                            </div>
                            <div style={{fontSize:13,color:C.muted,marginTop:4}}>{kb.final[0].score1} – {kb.final[0].score2}</div>
                            {kb.final[1]?.done&&(
                              <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid rgba(255,255,255,0.06)",fontSize:12,color:C.dim}}>
                                🥉 Hạng 3: <span style={{color:C.text,fontWeight:700}}>{kb.final[1].score1>kb.final[1].score2?kb.final[1].p1:kb.final[1].p2}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  </div>
                </div>
              </div>
            )}
            {showTourRegAdmin&&(
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:201,animation:"fadeIn 0.2s ease"}}>
                <div style={{background:"linear-gradient(160deg,#28281f 0%,#333329 100%)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"92vh",display:"flex",flexDirection:"column",border:"1px solid "+C.border}}>
                  {/* Handle bar */}
                  <div style={{width:40,height:4,background:"rgba(255,255,255,0.15)",borderRadius:4,margin:"12px auto 0",flexShrink:0}}/>
                  {/* Header */}
                  <div style={{padding:"12px 20px 0",flexShrink:0}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                      <div>
                        <div style={{fontWeight:800,fontSize:15,color:C.orange}}><Icon n="history" size={14} style={{marginRight:6}}/>Danh sách đăng ký</div>
                        <div style={{fontSize:11,color:C.dim,marginTop:2}}>{showTourRegAdmin.name} · {showTourRegAdmin.date}</div>
                      </div>
                      <button onClick={()=>{setShowTourRegAdmin(null);setTourRegAdminTab("pending");}} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:C.muted,borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:13,fontWeight:700}}><Icon n="x" size={13} style={{marginRight:4}}/>Đóng</button>
                    </div>
                    {/* Tabs */}
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,margin:"12px 0"}}>
                      {[
                        {key:"pending", label:"Chờ duyệt", color:"#FBbF24", bg:"rgba(251,191,36,0.12)", count:(showTourRegAdmin.tourRegs||[]).filter(r=>r.status==="pending").length},
                        {key:"approved", label:"Đã duyệt", color:"#4ADE80", bg:"rgba(74,222,128,0.12)", count:(showTourRegAdmin.tourRegs||[]).filter(r=>r.status==="approved").length},
                        {key:"rejected", label:"Từ chối", color:"#EF4444", bg:"rgba(239,68,68,0.12)", count:(showTourRegAdmin.tourRegs||[]).filter(r=>r.status==="rejected"||r.status==="cancelled").length},
                      ].map(tb=>(
                        <button key={tb.key} onClick={()=>setTourRegAdminTab(tb.key)} style={{padding:"10px 4px",borderRadius:12,border:"2px solid "+(tourRegAdminTab===tb.key?tb.color+"88":"rgba(255,255,255,0.07)"),background:tourRegAdminTab===tb.key?tb.bg:"transparent",cursor:"pointer",textAlign:"center",transition:"all 0.15s"}}>
                          <div style={{fontSize:22,fontWeight:900,color:tb.color,lineHeight:1}}>{tb.count}</div>
                          <div style={{fontSize:10,color:tourRegAdminTab===tb.key?tb.color:C.dim,marginTop:3,fontWeight:tourRegAdminTab===tb.key?700:400}}>{tb.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Scrollable list */}
                  <div style={{overflowY:"auto",flex:1,padding:"0 20px 24px"}}>
                    {(()=>{
                      const filtered=(showTourRegAdmin.tourRegs||[]).filter(r=>tourRegAdminTab==="rejected"?(r.status==="rejected"||r.status==="cancelled"):r.status===tourRegAdminTab);
                      if(!filtered.length) return(
                        <div style={{textAlign:"center",padding:"40px 0"}}>
                          <div style={{fontSize:36,marginBottom:10}}>{tourRegAdminTab==="pending"?"":tourRegAdminTab==="approved"?"✓":""}</div>
                          <div style={{color:C.dim,fontSize:13}}>Không có đăng ký nào</div>
                        </div>
                      );
                      return filtered.map((r,i,arr)=>{
                        const p1=allPlayers.find(p=>p.name===r.playerName);
                        const p2=r.partner?allPlayers.find(p=>p.name===r.partner):null;
                        return(
                        <div key={r.id||i} style={{padding:"14px 0",borderBottom:i!==arr.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
                          {/* Player info row */}
                          <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:10}}>
                            <div style={{width:42,height:42,borderRadius:12,background:r.content==="single"?"rgba(236,122,28,0.12)":"rgba(96,165,250,0.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:20}}>
                              {r.content==="single"?"":""}
                            </div>
                            <div style={{flex:1,minWidth:0}}>
                              {/* Người đăng ký */}
                              <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                                <span style={{fontWeight:800,fontSize:15,color:C.text}}>{r.playerName}</span>
                                {p1&&<TierChip tier={p1.tier}/>}
                                {p1&&<span style={{fontSize:11,color:TIER_COLORS[p1.tier],fontWeight:700}}>{p1.boom.toFixed(2)}</span>}
                                {!p1&&<span style={{fontSize:10,color:C.dim,fontStyle:"italic"}}>Chưa có trong hệ thống</span>}
                              </div>
                              {/* Đồng đội (nếu có) */}
                              {r.partner&&(
                                <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginTop:4,paddingTop:4,borderTop:"1px dashed rgba(255,255,255,0.08)"}}>
                                  <span style={{fontSize:10,color:C.dim,flexShrink:0}}> Đồng đội:</span>
                                  <span style={{fontWeight:700,fontSize:13,color:C.text}}>{r.partner}</span>
                                  {p2&&<TierChip tier={p2.tier}/>}
                                  {p2&&<span style={{fontSize:11,color:TIER_COLORS[p2.tier],fontWeight:700}}>{p2.boom.toFixed(2)}</span>}
                                  {!p2&&<span style={{fontSize:10,color:C.dim,fontStyle:"italic"}}>Chưa có trong hệ thống</span>}
                                </div>
                              )}
                              {/* Meta */}
                              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:5}}>
                                <span style={{fontSize:10,color:C.dim}}> {r.time}</span>
                                {r.phone&&<span style={{fontSize:10,color:"#f4954a"}}> {r.phone}</span>}
                          {r.note&&<span style={{fontSize:10,color:"#e6a53a",fontStyle:"italic"}}> {r.note}</span>}
                              </div>
                              {r.approvedBy&&<div style={{fontSize:10,color:"#4ADE80",marginTop:3,fontWeight:600}}>✓ Duyệt bởi {r.approvedBy}</div>}
                              {r.rejectedBy&&<div style={{fontSize:10,color:"#EF4444",marginTop:3,fontWeight:600}}>✗ Từ chối{r.rejectReason?" · "+r.rejectReason:""}</div>}
                            </div>
                          </div>
                          {/* Action buttons */}
                          {r.status==="pending"&&can("canApproveTourReg")&&(
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                              <button onClick={()=>handleTourRegApprove(showTourRegAdmin,r.id)}
                                style={{background:"linear-gradient(90deg,rgba(74,222,128,0.18),rgba(74,222,128,0.1))",border:"1.5px solid rgba(74,222,128,0.5)",color:"#4ADE80",borderRadius:10,padding:"11px",cursor:"pointer",fontSize:14,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                                ✓ Duyệt
                              </button>
                              <button onClick={()=>{const reason=window.prompt("Lý do từ chối (có thể bỏ trống):")||"";handleTourRegReject(showTourRegAdmin,r.id,reason);}}
                                style={{background:"linear-gradient(90deg,rgba(239,68,68,0.18),rgba(239,68,68,0.1))",border:"1.5px solid rgba(239,68,68,0.5)",color:"#EF4444",borderRadius:10,padding:"11px",cursor:"pointer",fontSize:14,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                                ✗ Từ chối
                              </button>
                            </div>
                          )}
                          {r.status==="approved"&&can("canApproveTourReg")&&(
                            <button onClick={()=>handleTourRegReject(showTourRegAdmin,r.id,"Thu hồi")}
                              style={{width:"100%",background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.2)",color:"#EF4444",borderRadius:8,padding:"8px",cursor:"pointer",fontSize:11,fontWeight:600}}>
                              ↩ Thu hồi duyệt
                            </button>
                          )}
                          {r.status==="rejected"&&can("canApproveTourReg")&&(
                            <button onClick={()=>handleTourRegApprove(showTourRegAdmin,r.id)}
                              style={{width:"100%",background:"rgba(74,222,128,0.06)",border:"1px solid rgba(74,222,128,0.2)",color:"#4ADE80",borderRadius:8,padding:"8px",cursor:"pointer",fontSize:11,fontWeight:600}}>
                              ↩ Duyệt lại
                            </button>
                          )}
                        </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab==="rules"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {/* Hero banner */}
            <div style={{borderRadius:18,background:"linear-gradient(135deg,rgba(236,122,28,0.18) 0%,rgba(255,180,71,0.1) 100%)",border:"1px solid rgba(236,122,28,0.3)",padding:"24px 20px",textAlign:"center",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"radial-gradient(circle,rgba(236,122,28,0.15),transparent 70%)",pointerEvents:"none"}}/>
              <div style={{fontSize:40,marginBottom:8}}><Icon n="ping2" size={14}/></div>
              <div style={{fontSize:22,fontWeight:900,letterSpacing:2,background:"linear-gradient(135deg,#ec7a1c,#e6a53a)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>PICKLEBOOM</div>
              <div style={{fontSize:12,color:C.muted,marginTop:4,letterSpacing:1}}>CLB Pickleball · Đà Nẵng</div>
              <div style={{display:"flex",justifyContent:"center",gap:16,marginTop:16}}>
                {[{v:allPlayers.length,l:"Thành viên"},{v:players.male.length,l:"Nam"},{v:players.female.length,l:"Nữ"},{v:tournaments.length,l:"Giải đấu"}].map((s,i)=>(
                  <div key={i} style={{textAlign:"center"}}>
                    <div style={{fontSize:20,fontWeight:900,color:C.orange}}>{s.v}</div>
                    <div style={{fontSize:10,color:C.dim,marginTop:1}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tier table */}
            <Card>
              <SectionTitle><Icon n="medal" size={14} color={C.orange} style={{marginRight:6}}/>Bảng phân hạng BOOM</SectionTitle>
              <div style={{display:"flex",flexDirection:"column",gap:0,borderRadius:10,overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"}}>
                {/* Header */}
                <div style={{display:"grid",gridTemplateColumns:"60px 1fr 70px 70px",background:"rgba(255,255,255,0.04)",padding:"8px 12px"}}>
                  {["Tier","Tên hạng","Nam","Nữ"].map((h,i)=>(
                    <div key={i} style={{fontSize:10,color:C.dim,fontWeight:700,textAlign:i>1?"center":"left"}}>{h}</div>
                  ))}
                </div>
                {[
                  {tier:"1+", name:"Cao thủ",   male:2.80, female:2.15},
                  {tier:"1-", name:"Tinh anh",  male:2.75, female:2.12},
                  {tier:"2++",name:"Xuất sắc",  male:2.70, female:null},
                  {tier:"2+", name:"Khá giỏi",  male:2.65, female:null},
                  {tier:"2",  name:"Trung bình",male:2.10, female:2.10},
                  {tier:"2-", name:"Cần cố gắng",male:2.05,female:2.05},
                  {tier:"3+", name:"Tập sự+",   male:2.55, female:null},
                  {tier:"3",  name:"Tập sự",    male:2.50, female:null},
                ].map((row,i,arr)=>(
                  <div key={i} style={{display:"grid",gridTemplateColumns:"60px 1fr 70px 70px",padding:"9px 12px",background:i%2===0?"transparent":"rgba(255,255,255,0.015)",borderTop:"1px solid rgba(255,255,255,0.04)"}}>
                    <div><span style={{fontSize:11,padding:"2px 7px",borderRadius:20,fontWeight:800,border:"1px solid "+TIER_COLORS[row.tier]+"55",background:TIER_COLORS[row.tier]+"18",color:TIER_COLORS[row.tier]}}>{row.tier}</span></div>
                    <div style={{fontSize:12,color:C.text,fontWeight:600,alignSelf:"center"}}>{row.name}</div>
                    <div style={{fontSize:12,color:"#f4954a",fontWeight:700,textAlign:"center",alignSelf:"center"}}>{row.male.toFixed(2)}</div>
                    <div style={{fontSize:12,color:"#F9A8D4",fontWeight:700,textAlign:"center",alignSelf:"center"}}>{row.female!=null?row.female.toFixed(2):"—"}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:10,color:C.dim,marginTop:10,lineHeight:1.6}}>
                 Điểm BOOM được cập nhật sau mỗi giải đấu chính thức. Điểm khởi điểm: Nam 2.50 · Nữ 2.10
              </div>
            </Card>

            {/* Rules */}
            <Card>
              <SectionTitle><Icon n="rules" size={14} color={C.orange} style={{marginRight:6}}/>Quy định chung</SectionTitle>
              <div style={{display:"flex",flexDirection:"column",gap:0}}>
                {[
                  {num:"01", text:"VĐV mới đăng ký qua app và chờ Admin xét duyệt trước khi được vào hệ thống."},
                  {num:"02", text:"Điểm BOOM chỉ được điều chỉnh bởi Admin/Mod sau giải đấu có kiểm soát."},
                  {num:"03", text:"Mọi thay đổi điểm đều được lưu lịch sử — có thể tra cứu bất kỳ lúc nào."},
                  {num:"04", text:"Đăng ký thi đấu cần được duyệt trước khi tham gia. Vui lòng đăng ký đúng hạn."},
                  {num:"05", text:"Trọng tài dùng mã PIN giải đấu để nhập điểm trực tiếp lên hệ thống."},
                  {num:"06", text:"Tinh thần thể thao là trên hết — tôn trọng đối thủ và quyết định của trọng tài."},
                ].map((r,i,arr)=>(
                  <div key={i} style={{display:"flex",gap:12,padding:"11px 0",borderBottom:i!==arr.length-1?"1px solid rgba(255,255,255,0.05)":"none",alignItems:"flex-start"}}>
                    <span style={{fontSize:11,fontWeight:900,color:C.orange,flexShrink:0,width:24,height:24,borderRadius:"50%",background:"rgba(236,122,28,0.12)",display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>{r.num}</span>
                    <span style={{fontSize:13,color:C.muted,lineHeight:1.6}}>{r.text}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Contact */}
            <Card style={{background:"rgba(236,122,28,0.05)",border:"1px solid rgba(236,122,28,0.2)"}}>
              <SectionTitle><Icon n="location" size={14} color={C.orange} style={{marginRight:6}}/>Liên hệ</SectionTitle>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[
                  {icon:"location",label:"Địa điểm","value":"Đà Nẵng, Việt Nam"},
                  {icon:"fb",label:"Fanpage","value":"facebook.com/pickleboomdn"},
                  {icon:"mail",label:"Email","value":"pickleboom@gmail.com"},
                ].map((c,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                    <Icon n={c.icon} size={16} color={C.orange} style={{width:28}}/>
                    <div>
                      <div style={{fontSize:10,color:C.dim,fontWeight:600}}>{c.label}</div>
                      <div style={{fontSize:13,color:C.text,fontWeight:600,marginTop:1}}>{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </main>

      {playerHistoryView&&(()=>{
        const ps=getPlayerStats(playerHistoryView);
        const pl=allPlayers.find(p=>p.name===playerHistoryView);
        return(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:210,animation:"fadeIn 0.2s ease"}} onClick={()=>setPlayerHistoryView(null)}>
          <div onClick={e=>e.stopPropagation()} style={{background:"linear-gradient(160deg,#28281f 0%,#333329 100%)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"88vh",display:"flex",flexDirection:"column",border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.15)",borderRadius:4,margin:"12px auto 0",flexShrink:0}}/>
            {/* Header */}
            <div style={{padding:"14px 20px 0",flexShrink:0}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <div>
                  <div style={{fontWeight:900,fontSize:16,color:C.text}}>{playerHistoryView}</div>
                  {pl&&<div style={{display:"flex",gap:6,marginTop:5,alignItems:"center",flexWrap:"wrap"}}><TierChip tier={pl.tier}/><BoomBadge boom={pl.boom} tier={pl.tier}/><span style={{fontSize:10,color:C.dim}}>{pl.gender==="male"?"Nam":"Nữ"}</span>{pl.phone&&<span style={{fontSize:11,color:C.muted,background:"rgba(255,255,255,0.06)",borderRadius:6,padding:"1px 7px"}}> {pl.phone}</span>}</div>}
                </div>
                <button onClick={()=>setPlayerHistoryView(null)} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:C.muted,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:13,fontWeight:700}}><Icon n="x" size={13} style={{marginRight:4}}/>Đóng</button>
              </div>
              {/* Stats grid */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
                {[{label:"Trận",v:ps.totalMatches,c:C.orange},{label:"Thắng",v:ps.wins,c:"#4ADE80"},{label:"Thua",v:ps.losses,c:"#EF4444"},{label:"Tỉ lệ",v:ps.winRate+"%",c:"#60A5FA"}].map((s,i)=>(
                  <div key={i} style={{textAlign:"center",padding:"12px 4px",borderRadius:12,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>
                    <div style={{fontSize:22,fontWeight:900,color:s.c,lineHeight:1}}>{s.v}</div>
                    <div style={{fontSize:10,color:C.dim,marginTop:4}}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Match list */}
            <div style={{overflowY:"auto",flex:1,padding:"0 20px 24px"}}>
              {ps.matchHistory.length?(
                <div>
                  <div style={{fontSize:11,color:C.muted,fontWeight:700,marginBottom:10}}>Lịch sử thi đấu ({ps.matchHistory.length} trận)</div>
                  {ps.matchHistory.map((m,i,arr)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderBottom:i!==arr.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
                      <div style={{width:32,height:32,borderRadius:9,background:m.won?"rgba(74,222,128,0.15)":m.drew?"rgba(251,191,36,0.1)":"rgba(239,68,68,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:m.won?"#4ADE80":m.drew?"#FBbF24":"#EF4444",flexShrink:0,border:"1px solid "+(m.won?"rgba(74,222,128,0.3)":m.drew?"rgba(251,191,36,0.2)":"rgba(239,68,68,0.25)")}}>
                        {m.won?"W":m.drew?"D":"L"}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:700,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.opponent||"?"}</div>
                        <div style={{fontSize:10,color:C.dim,marginTop:2}}>{m.tourName} · Round {m.round} · {m.tourDate}</div>
                      </div>
                      <div style={{fontWeight:900,fontSize:16,color:m.won?"#4ADE80":m.drew?"#FBbF24":"#EF4444",flexShrink:0}}>{m.myScore}–{m.oppScore}</div>
                    </div>
                  ))}
                </div>
              ):(
                <div style={{textAlign:"center",padding:"40px 0"}}>
                  <div style={{fontSize:36,marginBottom:10}}><Icon n="ping2" size={14}/></div>
                  <div style={{color:C.dim,fontSize:13}}>Chưa có trận đấu nào</div>
                </div>
              )}
            </div>
          </div>
        </div>
        );
      })()}

      {showRegModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:200,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(160deg,#28281f 0%,#333329 100%)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"92vh",display:"flex",flexDirection:"column",border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.15)",borderRadius:4,margin:"12px auto 0",flexShrink:0}}/>
            <div style={{padding:"12px 20px 0",flexShrink:0}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <div style={{fontWeight:800,fontSize:16,color:"#f4954a"}}><Icon n="register" size={14} style={{marginRight:6}}/>Đăng ký thành viên</div>
                <button onClick={()=>{setShowRegModal(false);setRegSubmitted(false);}} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:C.muted,borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:13,fontWeight:700}}><Icon n="x" size={13} style={{marginRight:4}}/>Đóng</button>
              </div>
            </div>
            <div style={{overflowY:"auto",flex:1,padding:"0 20px 24px"}}>
              {!regSubmitted?(
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <input placeholder="Pickleball Name *" value={regForm.name} onChange={e=>setRegForm(f=>({...f,name:e.target.value}))} style={MS}/>
                  <div style={{position:"relative"}}>
                    <input placeholder="Số điện thoại *" value={regForm.phone} onChange={e=>{
                      const phone=e.target.value.trim();
                      setRegForm(f=>({...f,phone:e.target.value}));
                    }} style={{...MS,borderColor:regForm.phone&&allPlayers.find(p=>p.phone===regForm.phone.trim())?"#EF4444":regForm.phone&&regList.find(r=>r.phone===regForm.phone.trim()&&r.status==="pending")?"#FBbF24":undefined}} inputMode="tel" autoComplete="tel"/>
                    {regForm.phone&&(()=>{
                      const dup=allPlayers.find(p=>p.phone===regForm.phone.trim());
                      const dupReg=!dup&&regList.find(r=>r.phone===regForm.phone.trim()&&r.status==="pending");
                      if(dup) return <div style={{fontSize:11,color:"#EF4444",marginTop:4,fontWeight:600}}><Icon n="x" size={13} style={{marginRight:4}}/>SĐT đã có trong hệ thống: {dup.name}</div>;
                      if(dupReg) return <div style={{fontSize:11,color:"#FBbF24",marginTop:4,fontWeight:600}}> SĐT đang chờ duyệt: {dupReg.name}</div>;
                      return null;
                    })()}
                  </div>
                  <select value={regForm.gender} onChange={e=>setRegForm(f=>({...f,gender:e.target.value}))} style={MS}>
                    <option value="male">Nam</option><option value="female">Nữ</option>
                  </select>
                  <input placeholder="Email (tùy chọn)" value={regForm.email} onChange={e=>setRegForm(f=>({...f,email:e.target.value}))} style={MS}/>
                  <input placeholder="Điểm trình PVNA (tùy chọn)" value={regForm.pvna} onChange={e=>setRegForm(f=>({...f,pvna:e.target.value}))} style={MS}/>
                  <input placeholder="Ghi chú (tùy chọn)" value={regForm.note} onChange={e=>setRegForm(f=>({...f,note:e.target.value}))} style={MS}/>
                  <button onClick={handleRegister} disabled={regLoading||!!allPlayers.find(p=>p.phone===regForm.phone.trim())} style={{background:"linear-gradient(90deg,#60A5FA,#3B82F6)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700,boxShadow:"0 4px 12px rgba(96,165,250,0.3)",opacity:(regLoading||!!allPlayers.find(p=>p.phone===regForm.phone.trim()))?0.5:1,marginTop:4}}>
                    {regLoading?"Đang gửi...":"Gửi đăng ký"}
                  </button>
                  {isAdmin&&can("canApproveReg")&&!!regList.length&&(
                    <div style={{marginTop:8}}>
                      <div style={{fontSize:12,color:C.muted,fontWeight:600,marginBottom:8}}>Danh sách đăng ký ({regList.length})</div>
                      {regList.map((r,i)=>(
                        <div key={r.id||i} style={{padding:"10px 0",borderBottom:i!==regList.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontWeight:700,fontSize:13,color:C.text}}>{r.name} <span style={{color:r.gender==="male"?"#60A5FA":"#F9A8D4",fontSize:11}}>{r.gender==="male"?"Nam":"Nữ"}</span></div>
                              {r.phone&&<div style={{fontSize:11,color:"#f4954a"}}> {r.phone}</div>}
                          <div style={{fontSize:11,color:C.muted}}>{r.email&&r.email+" · "}{r.pvna&&"PVNA: "+r.pvna}</div>
                              <div style={{fontSize:10,color:C.dim,marginTop:2}}> {r.time}</div>
                            </div>
                            <span style={{fontSize:10,padding:"3px 8px",borderRadius:10,fontWeight:700,background:r.status==="approved"?"rgba(74,222,128,0.15)":r.status==="rejected"?"rgba(239,68,68,0.15)":"rgba(251,191,36,0.15)",color:r.status==="approved"?"#4ADE80":r.status==="rejected"?"#EF4444":"#FBbF24",flexShrink:0}}>{r.status==="approved"?"✓ Duyệt":r.status==="rejected"?"✗ Từ chối":" Chờ"}</span>
                          </div>
                          {r.status==="pending"&&(
                            <div style={{display:"flex",gap:8,marginTop:8}}>
                              <button onClick={()=>handleApproveReg(r)} style={{flex:1,background:"rgba(74,222,128,0.12)",border:"1px solid rgba(74,222,128,0.35)",color:"#4ADE80",borderRadius:8,padding:"7px",cursor:"pointer",fontSize:12,fontWeight:700}}>✓ Duyệt</button>
                              <button onClick={()=>handleRejectReg(r)} style={{flex:1,background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.35)",color:"#EF4444",borderRadius:8,padding:"7px",cursor:"pointer",fontSize:12,fontWeight:700}}>✗ Từ chối</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ):(
                <div style={{textAlign:"center",padding:"32px 0"}}>
                  <div style={{fontSize:48,marginBottom:12}}>✓</div>
                  <div style={{fontSize:16,fontWeight:700,color:"#4ADE80",marginBottom:8}}>Đã gửi đăng ký!</div>
                  <div style={{fontSize:13,color:C.muted,marginBottom:20}}>Chúng tôi sẽ xem xét và liên hệ qua email.</div>
                  <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                    <button onClick={()=>setRegSubmitted(false)} style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.35)",color:"#f4954a",borderRadius:10,padding:"10px 20px",cursor:"pointer",fontSize:13,fontWeight:700}}>Đăng ký thêm</button>
                    <button onClick={()=>{setShowRegModal(false);setRegSubmitted(false);}} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"10px 20px",cursor:"pointer",fontSize:13,fontWeight:700}}>Đóng</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAddModal&&can("canAddPlayers")&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",zIndex:200,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(160deg,#28281f 0%,#333329 100%)",borderRadius:"20px 20px 0 0",width:"100%",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 16px"}}/>
            <SectionTitle><Icon n="plus" size={14} color={C.orange} style={{marginRight:6}}/>Thêm VĐV mới</SectionTitle>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input placeholder="Họ tên *" value={newPlayer.name} onChange={e=>setNewPlayer(p=>({...p,name:e.target.value}))} style={MS}/>
              <div style={{display:"flex",gap:8}}>
                <select value={newPlayer.tier} onChange={e=>setNewPlayer(p=>({...p,tier:e.target.value}))} style={{...MS,flex:1}}>
                  {TIERS.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
                <select value={newPlayer.gender} onChange={e=>setNewPlayer(p=>({...p,gender:e.target.value}))} style={{...MS,flex:1}}>
                  <option value="male">Nam</option><option value="female">Nữ</option>
                </select>
              </div>
              <input placeholder=" Số điện thoại (tùy chọn)" value={newPlayer.phone} onChange={e=>setNewPlayer(p=>({...p,phone:e.target.value}))} style={MS} inputMode="tel"/>
              <input placeholder="Ghi chú (tùy chọn)" value={newPlayer.remark} onChange={e=>setNewPlayer(p=>({...p,remark:e.target.value}))} style={MS}/>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setShowAddModal(false)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
                <button onClick={handleAddPlayer} style={{flex:2,background:"linear-gradient(135deg,#ec7a1c,#f4954a)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Thêm VĐV</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {adjModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",zIndex:200,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(160deg,#28281f 0%,#333329 100%)",borderRadius:"20px 20px 0 0",width:"100%",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 16px"}}/>
            <SectionTitle><Icon n="bolt" size={14} color={C.orange} style={{marginRight:6}}/>Điều chỉnh điểm: {adjModal.name}</SectionTitle>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,padding:"10px 14px",borderRadius:10,background:"rgba(236,122,28,0.06)",border:"1px solid rgba(236,122,28,0.2)"}}>
              <TierChip tier={adjModal.tier}/>
              <span style={{fontWeight:700,fontSize:14}}>{adjModal.name}</span>
              <BoomBadge boom={adjModal.boom} tier={adjModal.tier}/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <select value={adjForm.type} onChange={e=>setAdjForm(f=>({...f,type:e.target.value}))} style={MS}>
                <option value="">Loại điều chỉnh</option>
                <option value="Vô địch giải">1st Vô địch giải</option>
                <option value="Á quân giải">2nd Á quân giải</option>
                <option value="Hạng 3 giải">3rd Hạng 3 giải</option>
                <option value="Thăng Tier">⬆️ Thăng Tier</option>
                <option value="Hạ Tier">⬇️ Hạ Tier</option>
                <option value="Điều chỉnh thủ công">Thủ công</option>
              </select>
              <input type="number" placeholder="Giá trị (+/-)" value={adjForm.value} onChange={e=>setAdjForm(f=>({...f,value:e.target.value}))} style={MS} step="0.01"/>
              <input placeholder="Ghi chú" value={adjForm.note} onChange={e=>setAdjForm(f=>({...f,note:e.target.value}))} style={MS}/>
              <div style={{fontSize:12,color:C.muted,textAlign:"center"}}>
                Điểm mới: <strong style={{color:C.orange}}>{(adjModal.boom+(parseFloat(adjForm.value)||0)).toFixed(3)}</strong>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setAdjModal(null)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
                <button onClick={handleAdjust} style={{flex:2,background:"linear-gradient(135deg,#ec7a1c,#f4954a)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Lưu điều chỉnh</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",zIndex:200,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(160deg,#28281f 0%,#333329 100%)",borderRadius:"20px 20px 0 0",width:"100%",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 16px"}}/>
            <SectionTitle><Icon n="edit" size={14} color={C.orange} style={{marginRight:6}}/>Sửa VĐV: {editModal.name}</SectionTitle>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input placeholder="Họ tên" value={editForm.name} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))} style={MS}/>
              <div style={{display:"flex",gap:8}}>
                <select value={editForm.tier} onChange={e=>setEditForm(f=>({...f,tier:e.target.value}))} style={{...MS,flex:1}}>
                  {TIERS.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
                <select value={editForm.gender} onChange={e=>setEditForm(f=>({...f,gender:e.target.value}))} style={{...MS,flex:1}}>
                  <option value="male">Nam</option><option value="female">Nữ</option>
                </select>
              </div>
              <input placeholder=" Số điện thoại" value={editForm.phone} onChange={e=>setEditForm(f=>({...f,phone:e.target.value}))} style={MS} inputMode="tel"/>
              <input placeholder="Ghi chú" value={editForm.remark} onChange={e=>setEditForm(f=>({...f,remark:e.target.value}))} style={MS}/>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setEditModal(null)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
                <button onClick={handleEditPlayer} style={{flex:2,background:"linear-gradient(90deg,#60A5FA,#3B82F6)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Lưu thay đổi</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(160deg,#28281f 0%,#333329 100%)",borderRadius:18,width:"100%",maxWidth:340,padding:24,border:"1px solid rgba(239,68,68,0.3)"}}>
            <div style={{fontSize:36,textAlign:"center",marginBottom:12}}><Icon n="trash" size={14}/></div>
            <div style={{fontWeight:800,fontSize:16,textAlign:"center",marginBottom:8}}>Xóa VĐV?</div>
            <div style={{fontSize:13,color:C.muted,textAlign:"center",marginBottom:20}}>Bạn có chắc chắn muốn xóa <strong style={{color:C.orange}}>{deleteConfirm.name}</strong>?</div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setDeleteConfirm(null)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
              <button onClick={()=>handleDeletePlayer(deleteConfirm)} style={{flex:1,background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.4)",color:"#EF4444",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Xóa</button>
            </div>
          </div>
        </div>
      )}

      {auth.showLogin&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:200,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(160deg,#28281f 0%,#333329 100%)",borderRadius:"20px 20px 0 0",width:"100%",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 16px"}}/>
            <SectionTitle><Icon n="key" size={14} color={C.orange} style={{marginRight:6}}/>Đăng nhập Admin</SectionTitle>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input placeholder="Tên đăng nhập" value={auth.u} onChange={e=>setAuth(a=>({...a,u:e.target.value}))} style={MS} autoCapitalize="none"/>
              <input placeholder="Mật khẩu" type="password" value={auth.p} onChange={e=>setAuth(a=>({...a,p:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={MS}/>
              {auth.err&&<div style={{color:"#EF4444",fontSize:12,textAlign:"center"}}>{auth.err}</div>}
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setAuth(a=>({...a,showLogin:false,err:"",u:"",p:""}))} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
                <button onClick={handleLogin} style={{flex:2,background:"linear-gradient(135deg,#ec7a1c,#f4954a)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Đăng nhập</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTourModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:200,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(160deg,#28281f 0%,#333329 100%)",borderRadius:"22px 22px 0 0",width:"100%",maxHeight:"90vh",display:"flex",flexDirection:"column",border:"1px solid "+C.border}}>
            <div style={{width:44,height:5,background:"rgba(255,255,255,0.18)",borderRadius:4,margin:"12px auto 0",flexShrink:0}}/>
            <div style={{padding:"12px 18px 0",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontWeight:900,fontSize:16,color:C.orange,display:"flex",alignItems:"center",gap:6}}><Icon n="tournament" size={15}/>Tạo giải đấu mới</div>
              <button onClick={()=>setShowTourModal(false)} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",color:C.muted,borderRadius:10,width:36,height:36,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon n="x" size={16}/></button>
            </div>
            <div style={{overflowY:"auto",flex:1,padding:"14px 18px",display:"flex",flexDirection:"column",gap:12}}>
              {/* Cover image upload */}
              <div>
                <div style={{fontSize:11,color:C.muted,marginBottom:7,fontWeight:700,letterSpacing:0.5,textTransform:"uppercase"}}>Ảnh cover giải đấu</div>
                <label style={{display:"block",cursor:"pointer"}}>
                  <input type="file" accept="image/*" style={{display:"none"}} onChange={async e=>{
                    const file=e.target.files[0];
                    if(!file) return;
                    if(file.size>3*1024*1024){showNotif("Ảnh tối đa 3MB","err");return;}
                    const b64=await readFileAsBase64(file);
                    setTourForm(f=>({...f,cover:b64}));
                  }}/>
                  {tourForm.cover?(
                    <div style={{position:"relative",borderRadius:12,overflow:"hidden",height:140}}>
                      <img src={tourForm.cover} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <span style={{color:"#fff",fontSize:12,fontWeight:700,background:"rgba(0,0,0,0.5)",padding:"6px 14px",borderRadius:20,display:"flex",alignItems:"center",gap:5}}><Icon n="edit" size={12}/>Đổi ảnh</span>
                      </div>
                      <button onMouseDown={e=>{e.preventDefault();e.stopPropagation();setTourForm(f=>({...f,cover:""}));}} style={{position:"absolute",top:8,right:8,background:"rgba(239,68,68,0.85)",border:"none",color:"#fff",borderRadius:20,width:28,height:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1}}><Icon n="x" size={13}/></button>
                    </div>
                  ):(
                    <div style={{height:120,borderRadius:12,border:"2px dashed rgba(236,122,28,0.35)",background:"rgba(236,122,28,0.04)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
                      <Icon n="plus" size={22} color="rgba(236,122,28,0.5)"/>
                      <span style={{fontSize:12,color:C.muted}}>Chạm để tải ảnh cover</span>
                      <span style={{fontSize:10,color:C.dim}}>JPG, PNG · tối đa 3MB</span>
                    </div>
                  )}
                </label>
              </div>
              <input placeholder="Tên giải *" value={tourForm.name} onChange={e=>setTourForm(f=>({...f,name:e.target.value}))} style={MS}/>
              <input type="date" value={tourForm.date} onChange={e=>setTourForm(f=>({...f,date:e.target.value}))} style={MS}/>
              <select value={tourForm.format} onChange={e=>setTourForm(f=>({...f,format:e.target.value}))} style={MS}>
                <option value="single">Đơn</option><option value="double">Đôi</option><option value="mixed">Hỗn hợp</option>
              </select>
              <div style={{display:"flex",gap:8}}>
                <select value={tourForm.rounds} onChange={e=>setTourForm(f=>({...f,rounds:e.target.value}))} style={{...MS,flex:1}}>
                  {[1,2,3,4,5,6,8].map(n=><option key={n} value={n}>{n} vòng</option>)}
                </select>
                <select value={tourForm.bestOf} onChange={e=>setTourForm(f=>({...f,bestOf:e.target.value}))} style={{...MS,flex:1}}>
                  <option value="1">Best of 1</option><option value="3">Best of 3</option><option value="5">Best of 5</option>
                </select>
              </div>
              <input placeholder="Mã PIN trọng tài (tự động nếu trống)" value={tourForm.pin} onChange={e=>setTourForm(f=>({...f,pin:e.target.value}))} style={MS}/>
              <input placeholder="Ghi chú (tùy chọn)" value={tourForm.note} onChange={e=>setTourForm(f=>({...f,note:e.target.value}))} style={MS}/>
            </div>
            <div style={{padding:"12px 18px",borderTop:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
              <button onClick={handleCreateTour} style={{width:"100%",background:"linear-gradient(135deg,#ec7a1c,#f4954a)",border:"none",color:"#fff",borderRadius:12,padding:"15px",cursor:"pointer",fontSize:15,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Icon n="plus" size={16}/>Tạo giải đấu</button>
            </div>
          </div>
        </div>
      )}

      {editTourModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:202,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(160deg,#28281f 0%,#333329 100%)",borderRadius:"22px 22px 0 0",width:"100%",maxHeight:"90vh",display:"flex",flexDirection:"column",border:"1px solid "+C.border}}>
            <div style={{width:44,height:5,background:"rgba(255,255,255,0.18)",borderRadius:4,margin:"12px auto 0",flexShrink:0}}/>
            <div style={{padding:"12px 18px 0",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontWeight:900,fontSize:15,color:C.orange,display:"flex",alignItems:"center",gap:6}}><Icon n="edit" size={14}/>Sửa giải đấu</div>
              <button onClick={()=>setEditTourModal(null)} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",color:C.muted,borderRadius:10,width:34,height:34,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon n="x" size={15}/></button>
            </div>
            <div style={{overflowY:"auto",flex:1,padding:"14px 18px",display:"flex",flexDirection:"column",gap:12}}>
              {/* Cover image */}
              <div>
                <div style={{fontSize:11,color:C.muted,marginBottom:7,fontWeight:700,letterSpacing:0.5,textTransform:"uppercase"}}>Ảnh cover</div>
                <label style={{display:"block",cursor:"pointer"}}>
                  <input type="file" accept="image/*" style={{display:"none"}} onChange={async e=>{
                    const file=e.target.files[0];
                    if(!file) return;
                    if(file.size>3*1024*1024){showNotif("Ảnh tối đa 3MB","err");return;}
                    const b64=await readFileAsBase64(file);
                    setEditTourModal(m=>({...m,form:{...m.form,cover:b64}}));
                  }}/>
                  {(editTourModal.form.cover||editTourModal.tour.cover)?(
                    <div style={{position:"relative",borderRadius:12,overflow:"hidden",height:120}}>
                      <img src={editTourModal.form.cover||editTourModal.tour.cover} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.3)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <span style={{color:"#fff",fontSize:12,fontWeight:700,background:"rgba(0,0,0,0.5)",padding:"5px 12px",borderRadius:20,display:"flex",alignItems:"center",gap:5}}><Icon n="edit" size={11}/>Đổi ảnh</span>
                      </div>
                      <button onMouseDown={e=>{e.preventDefault();e.stopPropagation();setEditTourModal(m=>({...m,form:{...m.form,cover:""}}));}} style={{position:"absolute",top:7,right:7,background:"rgba(239,68,68,0.85)",border:"none",color:"#fff",borderRadius:20,width:26,height:26,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon n="x" size={12}/></button>
                    </div>
                  ):(
                    <div style={{height:90,borderRadius:12,border:"2px dashed rgba(236,122,28,0.3)",background:"rgba(236,122,28,0.03)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
                      <Icon n="plus" size={18} color="rgba(236,122,28,0.45)"/>
                      <span style={{fontSize:11,color:C.dim}}>Thêm ảnh cover</span>
                    </div>
                  )}
                </label>
              </div>
              <input placeholder="Tên giải *" value={editTourModal.form.name} onChange={e=>setEditTourModal(m=>({...m,form:{...m.form,name:e.target.value}}))} style={MS}/>
              <input type="date" value={editTourModal.form.date} onChange={e=>setEditTourModal(m=>({...m,form:{...m.form,date:e.target.value}}))} style={MS}/>
              <select value={editTourModal.form.format} onChange={e=>setEditTourModal(m=>({...m,form:{...m.form,format:e.target.value}}))} style={MS}>
                <option value="single">Đơn</option><option value="double">Đôi</option><option value="mixed">Hỗn hợp</option>
              </select>
              <div style={{display:"flex",gap:8}}>
                <select value={editTourModal.form.rounds} onChange={e=>setEditTourModal(m=>({...m,form:{...m.form,rounds:e.target.value}}))} style={{...MS,flex:1}}>
                  {[1,2,3,4,5,6,8].map(n=><option key={n} value={n}>{n} vòng</option>)}
                </select>
                <select value={editTourModal.form.bestOf} onChange={e=>setEditTourModal(m=>({...m,form:{...m.form,bestOf:e.target.value}}))} style={{...MS,flex:1}}>
                  <option value="1">Best of 1</option><option value="3">Best of 3</option><option value="5">Best of 5</option>
                </select>
              </div>
              <input placeholder="Mã PIN trọng tài" value={editTourModal.form.pin} onChange={e=>setEditTourModal(m=>({...m,form:{...m.form,pin:e.target.value}}))} style={MS}/>
              <input placeholder="Ghi chú" value={editTourModal.form.note} onChange={e=>setEditTourModal(m=>({...m,form:{...m.form,note:e.target.value}}))} style={MS}/>
            </div>
            <div style={{padding:"12px 18px",borderTop:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
              <button onClick={handleUpdateTour} style={{width:"100%",background:"linear-gradient(135deg,#ec7a1c,#f4954a)",border:"none",color:"#fff",borderRadius:12,padding:"15px",cursor:"pointer",fontSize:15,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Icon n="check" size={16}/>Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}

      {showMatchModal&&activeTour&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:202,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(160deg,#28281f 0%,#333329 100%)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"85vh",overflowY:"auto",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 16px"}}/>
            <SectionTitle><Icon n="ping2" size={14} color={C.orange} style={{marginRight:6}}/>Thêm kết quả trận</SectionTitle>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <select value={matchForm.round} onChange={e=>setMatchForm(f=>({...f,round:e.target.value}))} style={MS}>
                {Array.from({length:activeTour.rounds||1},(_,i)=><option key={i+1} value={i+1}>Vòng {i+1}</option>)}
              </select>
              <div style={{display:"flex",gap:8}}>
                <input placeholder={activeTour.format==="double"?"Đội 1 - P1":"Người chơi 1"} value={matchForm.p1} onChange={e=>setMatchForm(f=>({...f,p1:e.target.value}))} style={{...MS,flex:1}}/>
                {activeTour.format==="double"&&<input placeholder="Đội 1 - P2" value={matchForm.p2} onChange={e=>setMatchForm(f=>({...f,p2:e.target.value}))} style={{...MS,flex:1}}/>}
              </div>
              <div style={{textAlign:"center",fontSize:13,color:C.dim,fontWeight:700}}>VS</div>
              <div style={{display:"flex",gap:8}}>
                <input placeholder={activeTour.format==="double"?"Đội 2 - P1":"Người chơi 2"} value={matchForm.p3} onChange={e=>setMatchForm(f=>({...f,p3:e.target.value}))} style={{...MS,flex:1}}/>
                {activeTour.format==="double"&&<input placeholder="Đội 2 - P2" value={matchForm.p4} onChange={e=>setMatchForm(f=>({...f,p4:e.target.value}))} style={{...MS,flex:1}}/>}
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input type="number" placeholder="Điểm Đội 1" value={matchForm.score1} onChange={e=>setMatchForm(f=>({...f,score1:e.target.value}))} style={{...MS,flex:1,textAlign:"center"}} min="0"/>
                <span style={{color:C.dim,fontWeight:800,fontSize:18,flexShrink:0}}>-</span>
                <input type="number" placeholder="Điểm Đội 2" value={matchForm.score2} onChange={e=>setMatchForm(f=>({...f,score2:e.target.value}))} style={{...MS,flex:1,textAlign:"center"}} min="0"/>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setShowMatchModal(false)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
                <button onClick={handleAddMatch} style={{flex:2,background:"linear-gradient(135deg,#ec7a1c,#f4954a)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Lưu kết quả</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTourRegForm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"flex-end",zIndex:220,animation:"fadeIn 0.18s ease"}}>
          <div style={{background:"linear-gradient(160deg,#28281f 0%,#333329 100%)",borderRadius:"22px 22px 0 0",width:"100%",maxHeight:"92vh",display:"flex",flexDirection:"column",border:"1px solid "+C.border,boxShadow:"0 -8px 40px rgba(0,0,0,0.6)"}}>
            {/* Drag handle */}
            <div style={{width:44,height:5,background:"rgba(255,255,255,0.18)",borderRadius:4,margin:"12px auto 0",flexShrink:0}}/>
            {/* Header bar */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 18px 10px",flexShrink:0,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
              <div>
                <div style={{fontWeight:900,fontSize:16,color:C.orange,display:"flex",alignItems:"center",gap:6}}>
                  <Icon n="register" size={15} color={C.orange}/>Đăng ký thi đấu
                </div>
                <div style={{fontSize:11,color:C.muted,marginTop:2,display:"flex",alignItems:"center",gap:5}}>
                  <Icon n="tournament" size={11}/>{showTourRegForm.name}
                  <span style={{color:C.dim}}>·</span>
                  <Icon n="calendar" size={11}/>{showTourRegForm.date}
                  <span style={{color:C.dim}}>·</span>
                  <span style={{color:C.orange,fontWeight:700}}>{showTourRegForm.format==="single"?"Đơn":showTourRegForm.format==="double"?"Đôi":"Hỗn hợp"}</span>
                </div>
              </div>
              <button onClick={()=>{setShowTourRegForm(null);setTourRegSubmitted(false);}} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",color:C.muted,borderRadius:10,width:36,height:36,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon n="x" size={16}/>
              </button>
            </div>
            {/* Scrollable body */}
            <div style={{overflowY:"auto",flex:1,padding:"16px 18px",WebkitOverflowScrolling:"touch"}}>
            {!tourRegSubmitted?(
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {/* Format toggle - only for mixed */}
                {showTourRegForm.format!=="single"&&(
                  <div>
                    <div style={{fontSize:11,color:C.muted,marginBottom:7,fontWeight:700,letterSpacing:0.5,textTransform:"uppercase"}}>Hình thức</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      {["single","double"].map(ct=>(
                        <button key={ct} onClick={()=>setTourRegForm(f=>({...f,content:ct,partner:ct==="single"?"":f.partner}))}
                          style={{padding:"12px 8px",borderRadius:12,border:"2px solid "+(tourRegForm.content===ct?C.orange:"rgba(255,255,255,0.1)"),background:tourRegForm.content===ct?"rgba(236,122,28,0.12)":"rgba(255,255,255,0.03)",color:tourRegForm.content===ct?C.orange:C.muted,cursor:"pointer",fontWeight:700,fontSize:14,transition:"all 0.15s"}}>
                          {ct==="single"?"Đánh đơn":"Đánh đôi"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {/* Player name autocomplete */}
                <div>
                  <div style={{fontSize:11,color:C.muted,marginBottom:7,fontWeight:700,letterSpacing:0.5,textTransform:"uppercase"}}>
                    Tên VĐV <span style={{color:"#EF4444"}}>*</span>
                  </div>
                  <div style={{position:"relative"}}>
                    <input
                      placeholder="Tìm tên trong hệ thống..."
                      value={tourRegForm.playerName}
                      onChange={e=>{setTourRegForm(f=>({...f,playerName:e.target.value}));setRegPlayerFocus(true);}}
                      onFocus={()=>setRegPlayerFocus(true)}
                      onBlur={()=>setTimeout(()=>setRegPlayerFocus(false),200)}
                      style={{...MS,paddingRight:tourRegForm.playerName?36:MS.padding}}
                      autoComplete="off"
                    />
                    {tourRegForm.playerName&&(
                      <button onMouseDown={()=>setTourRegForm(f=>({...f,playerName:""}))} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.1)",border:"none",color:C.muted,borderRadius:20,width:22,height:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <Icon n="x" size={11}/>
                      </button>
                    )}
                    {regPlayerFocus&&(
                      <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,zIndex:999,background:"#2a2a22",border:"1px solid "+C.border,borderRadius:12,maxHeight:220,overflowY:"auto",boxShadow:"0 12px 32px rgba(0,0,0,0.7)"}}>
                        {(()=>{
                          const filtered=allPlayers.filter(p=>!tourRegForm.playerName||p.name.toLowerCase().includes(tourRegForm.playerName.toLowerCase())).slice(0,15);
                          if(!filtered.length) return <div style={{padding:"14px",fontSize:13,color:C.dim,textAlign:"center"}}>Không tìm thấy VĐV</div>;
                          return filtered.map(p=>(
                            <div key={p.id} onMouseDown={()=>{setTourRegForm(f=>({...f,playerName:p.name}));setRegPlayerFocus(false);}}
                              style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.05)",transition:"background 0.1s"}}
                              onMouseEnter={e=>e.currentTarget.style.background="rgba(236,122,28,0.1)"}
                              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                              <div style={{width:32,height:32,borderRadius:8,background:p.gender==="male"?"rgba(96,165,250,0.15)":"rgba(249,168,212,0.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                                <Icon n={p.gender==="male"?"male":"female"} size={14} color={p.gender==="male"?"#60A5FA":"#F9A8D4"}/>
                              </div>
                              <span style={{flex:1,fontSize:14,fontWeight:600,color:C.text}}>{p.name}</span>
                              <TierChip tier={p.tier}/>
                              <BoomBadge boom={p.boom} tier={p.tier}/>
                            </div>
                          ));
                        })()}
                      </div>
                    )}
                  </div>
                </div>
                {/* Partner autocomplete */}
                {tourRegForm.content==="double"&&(
                  <div>
                    <div style={{fontSize:11,color:C.muted,marginBottom:7,fontWeight:700,letterSpacing:0.5,textTransform:"uppercase"}}>
                      Đồng đội <span style={{color:"#EF4444"}}>*</span>
                    </div>
                    <div style={{position:"relative"}}>
                      <input
                        placeholder="Tìm tên đồng đội..."
                        value={tourRegForm.partner}
                        onChange={e=>{setTourRegForm(f=>({...f,partner:e.target.value}));setRegPartnerFocus(true);}}
                        onFocus={()=>setRegPartnerFocus(true)}
                        onBlur={()=>setTimeout(()=>setRegPartnerFocus(false),200)}
                        style={{...MS}}
                        autoComplete="off"
                      />
                      {tourRegForm.partner&&(
                        <button onMouseDown={()=>setTourRegForm(f=>({...f,partner:""}))} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.1)",border:"none",color:C.muted,borderRadius:20,width:22,height:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                          <Icon n="x" size={11}/>
                        </button>
                      )}
                      {regPartnerFocus&&(
                        <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,zIndex:999,background:"#2a2a22",border:"1px solid "+C.border,borderRadius:12,maxHeight:220,overflowY:"auto",boxShadow:"0 12px 32px rgba(0,0,0,0.7)"}}>
                          {(()=>{
                            const filtered=allPlayers.filter(p=>p.name!==tourRegForm.playerName&&(!tourRegForm.partner||p.name.toLowerCase().includes(tourRegForm.partner.toLowerCase()))).slice(0,15);
                            if(!filtered.length) return <div style={{padding:"14px",fontSize:13,color:C.dim,textAlign:"center"}}>Không tìm thấy VĐV</div>;
                            return filtered.map(p=>(
                              <div key={p.id} onMouseDown={()=>{setTourRegForm(f=>({...f,partner:p.name}));setRegPartnerFocus(false);}}
                                style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.05)",transition:"background 0.1s"}}
                                onMouseEnter={e=>e.currentTarget.style.background="rgba(236,122,28,0.1)"}
                                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                                <div style={{width:32,height:32,borderRadius:8,background:p.gender==="male"?"rgba(96,165,250,0.15)":"rgba(249,168,212,0.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                                  <Icon n={p.gender==="male"?"male":"female"} size={14} color={p.gender==="male"?"#60A5FA":"#F9A8D4"}/>
                                </div>
                                <span style={{flex:1,fontSize:14,fontWeight:600,color:C.text}}>{p.name}</span>
                                <TierChip tier={p.tier}/>
                                <BoomBadge boom={p.boom} tier={p.tier}/>
                              </div>
                            ));
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* Preview selected pair */}
                {tourRegForm.playerName&&(
                  <div style={{background:"rgba(236,122,28,0.07)",border:"1px solid rgba(236,122,28,0.2)",borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}>
                    <Icon n="user" size={16} color={C.orange}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:700,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tourRegForm.playerName}{tourRegForm.content==="double"&&tourRegForm.partner?" & "+tourRegForm.partner:""}</div>
                      <div style={{fontSize:11,color:C.muted,marginTop:1}}>{tourRegForm.content==="double"?"Đôi":"Đơn"} · {showTourRegForm.name}</div>
                    </div>
                    <Icon n="check" size={14} color="#4ADE80"/>
                  </div>
                )}
                {/* Note */}
                <div>
                  <div style={{fontSize:11,color:C.muted,marginBottom:7,fontWeight:700,letterSpacing:0.5,textTransform:"uppercase"}}>Ghi chú</div>
                  <input placeholder="Yêu cầu đặc biệt (nếu có)..." value={tourRegForm.note} onChange={e=>setTourRegForm(f=>({...f,note:e.target.value}))} style={{...MS}}/>
                </div>
                {/* Info notice */}
                <div style={{fontSize:11,color:C.muted,padding:"10px 14px",borderRadius:10,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"flex-start",gap:8,lineHeight:1.5}}>
                  <Icon n="shield" size={13} color={C.dim} style={{marginTop:1,flexShrink:0}}/>
                  Đăng ký sẽ được Admin/Mod xét duyệt. Kết quả sẽ được thông báo sớm nhất có thể.
                </div>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"24px 0 16px",gap:16}}>
                {/* Success icon */}
                <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(74,222,128,0.12)",border:"2px solid rgba(74,222,128,0.35)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Icon n="check" size={32} color="#4ADE80"/>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:20,fontWeight:900,color:"#4ADE80",marginBottom:6}}>Đăng ký thành công!</div>
                  <div style={{fontSize:13,color:C.muted,lineHeight:1.6}}>Yêu cầu của bạn đã được ghi nhận</div>
                </div>
                {/* Tour info card */}
                <div style={{width:"100%",background:"rgba(236,122,28,0.07)",border:"1px solid rgba(236,122,28,0.2)",borderLeft:"3px solid "+C.orange,borderRadius:12,padding:"14px 16px",display:"flex",flexDirection:"column",gap:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <Icon n="tournament" size={14} color={C.orange}/>
                    <span style={{fontWeight:800,fontSize:14,color:C.orange}}>{showTourRegForm.name}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <Icon n="calendar" size={13} color={C.muted}/>
                    <span style={{fontSize:13,color:C.muted}}>{showTourRegForm.date}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <Icon n="user" size={13} color={C.muted}/>
                    <span style={{fontSize:13,color:C.text,fontWeight:600}}>{tourRegForm.playerName||"—"}</span>
                    {tourRegForm.content==="double"&&tourRegForm.partner&&<><span style={{color:C.dim}}>+</span><span style={{fontSize:13,color:C.text,fontWeight:600}}>{tourRegForm.partner}</span></>}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,paddingTop:6,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                    <Icon n="history" size={12} color="#FBbF24"/>
                    <span style={{fontSize:11,color:"#FBbF24",fontWeight:600}}>Đang chờ Admin/Mod xét duyệt</span>
                  </div>
                </div>
                <button onClick={()=>{setShowTourRegForm(null);setTourRegSubmitted(false);}} style={{width:"100%",background:"linear-gradient(135deg,#ec7a1c,#f4954a)",border:"none",color:"#fff",borderRadius:12,padding:"14px",cursor:"pointer",fontSize:15,fontWeight:700,boxShadow:"0 4px 16px rgba(236,122,28,0.3)"}}>
                  Đóng
                </button>
              </div>
            )}
            </div>
            {/* Sticky submit button */}
            {!tourRegSubmitted&&(
              <div style={{padding:"12px 18px",borderTop:"1px solid rgba(255,255,255,0.06)",flexShrink:0,background:"linear-gradient(160deg,#28281f 0%,#333329 100%)"}}>
                <button onClick={async()=>{
                  if(!tourRegForm.playerName.trim()){showNotif("Vui lòng chọn tên VĐV","err");return;}
                  if(tourRegForm.content==="double"&&!tourRegForm.partner.trim()){showNotif("Vui lòng chọn tên đồng đội","err");return;}
                  await handleTourRegister();
                }} style={{width:"100%",background:"linear-gradient(135deg,#ec7a1c,#f4954a)",border:"none",color:"#fff",borderRadius:12,padding:"15px",cursor:"pointer",fontSize:15,fontWeight:800,boxShadow:"0 4px 16px rgba(236,122,28,0.35)",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <Icon n="register" size={16}/>Gửi đăng ký
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showGroupDrawModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:202,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(160deg,#28281f 0%,#333329 100%)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"85vh",overflowY:"auto",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 16px"}}/>
            <SectionTitle><Icon n="target" size={14} color={C.orange} style={{marginRight:6}}/>Chia bảng: {showGroupDrawModal.name}</SectionTitle>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{display:"flex",gap:8}}>
                <select value={groupConfig.numGroups} onChange={e=>setGroupConfig(c=>({...c,numGroups:parseInt(e.target.value)}))} style={{...MS,flex:1}}>
                  {[2,3,4].map(n=><option key={n} value={n}>{n} bảng</option>)}
                </select>
                <select value={groupConfig.seedBy} onChange={e=>setGroupConfig(c=>({...c,seedBy:e.target.value}))} style={{...MS,flex:1}}>
                  <option value="tier">Theo Tier</option><option value="random">Ngẫu nhiên</option>
                </select>
              </div>
              <div style={{fontSize:11,color:C.muted}}>{groupConfig.players.filter(p=>p.selected).length} người được chọn</div>
              <div style={{maxHeight:200,overflowY:"auto",display:"flex",flexDirection:"column",gap:4}}>
                {groupConfig.players.map((p,i)=>(
                  <div key={i} onClick={()=>setGroupConfig(c=>({...c,players:c.players.map((pl,pi)=>pi===i?{...pl,selected:!pl.selected}:pl)}))}
                    style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,cursor:"pointer",background:p.selected?"rgba(236,122,28,0.1)":"rgba(255,255,255,0.04)",border:"1px solid "+(p.selected?"rgba(236,122,28,0.3)":"rgba(255,255,255,0.08)")}}>
                    <span style={{fontSize:14}}>{p.selected?"✓":"○"}</span>
                    <span style={{fontSize:13,flex:1}}>{p.name}</span>
                    <span style={{fontSize:10,color:C.dim}}>{p.boom.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setShowGroupDrawModal(null)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
                <button onClick={handleGenerateGroups} style={{flex:2,background:"linear-gradient(135deg,#ec7a1c,#f4954a)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}><Icon n="target" size={13} style={{marginRight:4}}/>Chia bảng</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {refMode&&(
        <div style={{position:"fixed",inset:0,background:"#1e1e1a",zIndex:999,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{background:"rgba(28,28,22,0.97)",borderBottom:"1px solid "+C.border,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontWeight:900,fontSize:16,color:C.orange}}>️ Chế độ Trọng tài</div>
            <button onClick={()=>{setRefMode(false);setRefTour(null);setRefMatch(null);setRefGames([]);setRefConfirmed(false);}} style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.35)",color:"#EF4444",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:700}}>✕ Thoát</button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:16}}>
            {!refTour&&(
              <div style={{display:"flex",flexDirection:"column",gap:16,paddingTop:24}}>
                <div style={{textAlign:"center",fontSize:36,marginBottom:8}}><Icon n="key" size={14}/></div>
                <div style={{textAlign:"center",fontWeight:700,fontSize:16,color:C.text}}>Nhập mã PIN giải đấu</div>
                <input placeholder="Mã PIN 4 chữ số" value={refPinInput} onChange={e=>setRefPinInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleRefPinSubmit()} style={{...MS,textAlign:"center",fontSize:24,letterSpacing:8,fontWeight:900}} maxLength={6} inputMode="numeric"/>
                {refPinErr&&<div style={{color:"#EF4444",fontSize:12,textAlign:"center"}}>{refPinErr}</div>}
                <button onClick={handleRefPinSubmit} style={{background:"linear-gradient(135deg,#ec7a1c,#f4954a)",border:"none",color:"#fff",borderRadius:10,padding:"14px",cursor:"pointer",fontSize:16,fontWeight:700}}>Xác nhận PIN</button>
              </div>
            )}
            {refTour&&!refMatch&&(
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div style={{fontWeight:800,fontSize:15,color:C.orange,marginBottom:4}}>{refTour.name}</div>
                <div style={{fontSize:12,color:C.dim,marginBottom:8}}>Chọn trận để nhập điểm:</div>
                {(refTour.matches||[]).map((m,i)=>(
                  <div key={m.id||i} onClick={()=>handleRefStartMatch(m)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid "+(m.confirmed?"rgba(74,222,128,0.3)":C.border),borderRadius:12,padding:"12px 14px",cursor:"pointer"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <span style={{fontSize:10,color:C.dim}}>R{m.round}</span>
                      {m.confirmed&&<span style={{fontSize:10,color:"#4ADE80",fontWeight:700}}>✓ Đã xác nhận</span>}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{flex:1,fontSize:13,fontWeight:600,textAlign:"right",color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(m.team1||[]).join(" & ")}</span>
                      <span style={{fontWeight:900,fontSize:16,color:C.orange,flexShrink:0,padding:"2px 10px",background:"rgba(236,122,28,0.1)",borderRadius:6}}>{m.score1} - {m.score2}</span>
                      <span style={{flex:1,fontSize:13,fontWeight:600,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(m.team2||[]).join(" & ")}</span>
                    </div>
                  </div>
                ))}
                {!(refTour.matches||[]).length&&<div style={{textAlign:"center",color:C.dim,padding:24}}>Chưa có trận đấu nào trong giải</div>}
              </div>
            )}
            {refTour&&refMatch&&(
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                  <button onClick={handleRefExitMatch} style={{background:"rgba(255,255,255,0.06)",border:"none",color:C.muted,borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:13}}>← Quay lại</button>
                  <div style={{fontWeight:800,fontSize:14,color:C.orange}}>Vòng {refMatch.round}</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:8,alignItems:"center",marginBottom:8}}>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontWeight:700,fontSize:14,color:C.text}}>{(refMatch.team1||[]).join(" & ")}</div>
                    <div style={{fontSize:22,fontWeight:900,color:C.orange,marginTop:4}}>{refGames.filter(g=>parseInt(g.t1)>parseInt(g.t2)).length}</div>
                  </div>
                  <div style={{textAlign:"center",fontSize:12,color:C.dim,fontWeight:700}}>VS</div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontWeight:700,fontSize:14,color:C.text}}>{(refMatch.team2||[]).join(" & ")}</div>
                    <div style={{fontSize:22,fontWeight:900,color:C.orange,marginTop:4}}>{refGames.filter(g=>parseInt(g.t2)>parseInt(g.t1)).length}</div>
                  </div>
                </div>
                {refGames.map((g,i)=>(
                  <div key={i} style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px 14px",border:"1px solid "+C.border}}>
                    <div style={{fontSize:11,color:C.dim,marginBottom:8,fontWeight:600}}>Ván {i+1}</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:8,alignItems:"center"}}>
                      <input type="number" placeholder="0" value={g.t1} onChange={e=>setRefGames(gs=>gs.map((gx,xi)=>xi===i?{...gx,t1:e.target.value}:gx))} style={{...MS,textAlign:"center",fontSize:22,fontWeight:900,padding:"10px"}} min="0" inputMode="numeric"/>
                      <span style={{color:C.dim,fontWeight:800,fontSize:16}}>-</span>
                      <input type="number" placeholder="0" value={g.t2} onChange={e=>setRefGames(gs=>gs.map((gx,xi)=>xi===i?{...gx,t2:e.target.value}:gx))} style={{...MS,textAlign:"center",fontSize:22,fontWeight:900,padding:"10px"}} min="0" inputMode="numeric"/>
                    </div>
                  </div>
                ))}
                {refConfirmed&&<div style={{textAlign:"center",padding:12,borderRadius:10,background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.3)",color:"#4ADE80",fontWeight:700,fontSize:14}}>✓ Đã lưu kết quả!</div>}
                <button onClick={handleRefSaveMatch} style={{background:"linear-gradient(135deg,#ec7a1c,#f4954a)",border:"none",color:"#fff",borderRadius:10,padding:"16px",cursor:"pointer",fontSize:16,fontWeight:700,boxShadow:"0 4px 16px rgba(236,122,28,0.4)"}}>
                  {refConfirmed?"Cập nhật lại":" Xác nhận kết quả"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <nav style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(28,28,22,0.98)",borderTop:"2px solid "+C.border,display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom,0px)",boxShadow:"0 -4px 24px rgba(0,0,0,0.5)"}}>
        {NAV.filter(t=>!t.adminOnly||isAdmin).map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)}
            style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"10px 2px 7px",border:"none",background:"transparent",cursor:"pointer",color:tab===t.key?C.orange:C.dim,transition:"color 0.2s",position:"relative",minHeight:52}}>
            {tab===t.key&&<div style={{position:"absolute",top:0,left:"25%",right:"25%",height:2,background:C.orange,borderRadius:1,height:3}}/>}
            <Icon n={t.icon} size={20}/>
            <span style={{fontSize:"clamp(8px,2.2vw,10px)",fontWeight:tab===t.key?700:500,letterSpacing:0.2,whiteSpace:"nowrap"}}>{t.label}</span>
          </button>
        ))}
      </nav>


    </div>
    </>
  );
}