import { useState, useMemo, useEffect, useCallback } from "react";

const TIER_COLORS = {
  "1+":"#FF6B35","1-":"#FF8C5A","2++":"#FFB347","2+":"#FFC87A",
  "2":"#6B7280","2-":"#9CA3AF","3+":"#D1D5DB","3":"#E5E7EB",
};
const TIER_BOOM = {
  "1+":2.8,"1-":2.75,"2++":2.7,"2+":2.65,"2":2.1,"2-":2.05,"3+":2.55,"3":2.5,
};
const TIERS = ["1+","1-","2++","2+","2","2-","3+","3"];
const ADMIN_CREDENTIALS = [
  {username:"admin",password:"pickleboom@2026",label:"Administrator"},
  {username:"huypham",password:"captain@2026",label:"Huy Phạm "},
];

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
  orange:"#FF6B35",orange2:"#FF8C5A",bg:"#111",bg2:"#181818",bg3:"#222",
  border:"rgba(255,107,53,0.2)",text:"#E5E7EB",muted:"#9CA3AF",dim:"#4B5563",
};

// ─── Reusable tiny components ────────────────────────────────────────────────
function TierChip({tier}){
  return <span style={{fontSize:10,padding:"2px 7px",borderRadius:20,fontWeight:800,border:`1px solid ${TIER_COLORS[tier]}55`,background:TIER_COLORS[tier]+"18",color:TIER_COLORS[tier],flexShrink:0}}>{tier}</span>;
}
function BoomBadge({boom,tier}){
  return <span style={{padding:"3px 10px",borderRadius:20,fontSize:13,fontWeight:800,color:TIER_COLORS[tier],background:TIER_COLORS[tier]+"1a",border:`1px solid ${TIER_COLORS[tier]}33`}}>{boom.toFixed(2)}</span>;
}
function Card({children,style={}}){
  return <div style={{background:"rgba(255,255,255,0.028)",border:`1px solid ${C.border}`,borderRadius:18,padding:16,...style}}>{children}</div>;
}
function SectionTitle({children}){
  return <div style={{fontSize:13,fontWeight:700,color:C.orange,marginBottom:12,letterSpacing:0.5,textTransform:"uppercase"}}>{children}</div>;
}

// Modal input shared style
const MS = {
  width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,107,53,0.25)",
  borderRadius:10,padding:"11px 14px",color:"#E5E7EB",fontSize:15,outline:"none",boxSizing:"border-box",
};

// ─── Supabase config ───────────────────────────────────────────────────────
const SB_URL = "https://oevgauxkildxdrqnphnw.supabase.co";
const SB_KEY = "sb_publishable_rG83Er1StQyQr3bk3eX6jQ_vVcSUs3f";

const sbFetch = async (path, options={}) => {
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    headers: {
      "apikey": SB_KEY,
      "Authorization": `Bearer ${SB_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

// Convert flat DB row → app player object
const rowToPlayer = (r) => ({
  id: r.id,
  name: r.name,
  tier: r.tier,
  boom: r.boom,
  gender: r.gender,
  remark: r.remark || "",
});

// Convert flat DB rows → {male:[...], female:[...]}
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
  const [newPlayer,setNewPlayer]=useState({name:"",tier:"3",gender:"male",remark:""});
  const [adjForm,setAdjForm]=useState({type:"",value:0,note:""});
  const [editModal,setEditModal]=useState(null);
  const [editForm,setEditForm]=useState({name:"",tier:"3",gender:"male",remark:""});
  const [deleteConfirm,setDeleteConfirm]=useState(null);
  const [history,setHistory]=useState([]);
  const [notif,setNotif]=useState(null);
  const [auth,setAuth]=useState({loggedIn:false,user:null,showLogin:false,u:"",p:"",err:""});
  const [rankGender,setRankGender]=useState("male");
  const [mmSearch,setMmSearch]=useState("");
  const [mmGender,setMmGender]=useState("all");
  const [mmSel,setMmSel]=useState([]);
  const [mmResult,setMmResult]=useState(null);
  const [dbReady,setDbReady]=useState(false);
  const [syncing,setSyncing]=useState(false);
  const [regForm,setRegForm]=useState({name:"",email:"",pvna:"",gender:"male",note:""});
  const [regList,setRegList]=useState([]);
  const [regSubmitted,setRegSubmitted]=useState(false);
  const [regLoading,setRegLoading]=useState(false);

  // ── Load data from Supabase on mount ──
  useEffect(()=>{
    const load = async () => {
      setSyncing(true);
      try {
        const [pRows, hRows, rRows] = await Promise.all([
          sbFetch("players?select=*&order=id.asc"),
          sbFetch("history?select=*&order=created_at.desc&limit=100"),
          sbFetch("registrations?select=*&order=id.desc&limit=200"),
        ]);
        if (pRows && pRows.length > 0) {
          setPlayers(rowsToPlayers(pRows));
        } else {
          // First time: seed database with INIT data
          await seedDatabase();
        }
        if (hRows) {
          setHistory(hRows.map(r=>({id:r.id,action:r.action,player:r.player,detail:r.detail||"",time:r.time||""})));
        }
        if (rRows) setRegList(rRows);
        setDbReady(true);
      } catch(e) {
        console.error("Supabase load error:", e);
        setDbReady(true); // fall through to local state
      }
      setSyncing(false);
    };
    load();
  }, []);

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

  const mmPool=useMemo(()=>allPlayers.filter(p=>{
    const ms=p.name.toLowerCase().includes(mmSearch.toLowerCase());
    const mg=mmGender==="all"||p.gender===mmGender;
    return ms&&mg;
  }),[allPlayers,mmSearch,mmGender]);

  const isAdmin=auth.loggedIn;

  const showNotif=(msg,type="ok")=>{
    setNotif({msg,type});
    setTimeout(()=>setNotif(null),3000);
  };

  // ── Supabase write helper ──
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
    if(found){setAuth(a=>({...a,loggedIn:true,user:found,showLogin:false,err:"",u:"",p:""}));showNotif("Đăng nhập thành công");}
    else setAuth(a=>({...a,err:"Sai tên đăng nhập hoặc mật khẩu"}));
  };
  const handleLogout=()=>{setAuth({loggedIn:false,user:null,showLogin:false,u:"",p:"",err:""});showNotif("Đã đăng xuất");};

  const handleRegister=async()=>{
    if(!regForm.name.trim()||!regForm.email.trim()||!regForm.pvna.trim())return;
    setRegLoading(true);
    const entry={id:Date.now(),name:regForm.name.trim(),email:regForm.email.trim(),pvna:regForm.pvna.trim(),gender:regForm.gender,note:regForm.note.trim(),time:new Date().toLocaleString("vi-VN"),status:"pending"};
    setRegList(prev=>[entry,...prev]);
    try{await sbFetch("registrations",{method:"POST",body:JSON.stringify(entry)});}catch(e){console.error("reg:",e);}
    setRegSubmitted(true);
    setRegLoading(false);
    setRegForm({name:"",email:"",pvna:"",gender:"male",note:""});
  };

  const handleApproveReg=async(reg)=>{
    setRegList(prev=>prev.map(r=>r.id===reg.id?{...r,status:"approved"}:r));
    try{await sbFetch(`registrations?id=eq.${reg.id}`,{method:"PATCH",body:JSON.stringify({status:"approved"})});}catch(e){console.error(e);}
    showNotif(`Đã duyệt: ${reg.name}`);
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
    const p={id,name:newPlayer.name,tier:newPlayer.tier,boom,gender:newPlayer.gender,remark:newPlayer.remark||""};
    setPlayers(prev=>({...prev,[newPlayer.gender]:[...prev[newPlayer.gender],p]}));
    setNewPlayer({name:"",tier:"3",gender:"male",remark:""});
    setShowAddModal(false);
    showNotif("Đã thêm VĐV "+newPlayer.name);
    try {
      await sbFetch("players",{method:"POST",body:JSON.stringify({id,name:p.name,tier:p.tier,boom:p.boom,gender:p.gender,remark:p.remark||""})});
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
    if(editForm.gender!==p.gender){
      setPlayers(prev=>({
        ...prev,
        [p.gender]:prev[p.gender].filter(pl=>pl.id!==p.id),
        [editForm.gender]:[...prev[editForm.gender],{...p,name:editForm.name,tier:editForm.tier,boom:newBoom,gender:editForm.gender,remark:newRemark}],
      }));
    } else {
      setPlayers(prev=>({...prev,[p.gender]:prev[p.gender].map(pl=>pl.id===p.id?{...pl,name:editForm.name,tier:editForm.tier,boom:newBoom,remark:newRemark}:pl)}));
    }
    setEditModal(null);
    showNotif(`Đã cập nhật VĐV ${editForm.name}`);
    try {
      await sbFetch(`players?id=eq.${p.id}`,{method:"PATCH",body:JSON.stringify({name:editForm.name,tier:editForm.tier,boom:newBoom,gender:editForm.gender,remark:newRemark})});
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

  const analyzePairing=()=>{
    if(mmSel.length!==4)return;
    const [a,b,c,d]=mmSel;
    const pairs=[{tA:[a,b],tB:[c,d]},{tA:[a,c],tB:[b,d]},{tA:[a,d],tB:[b,c]}].map(p=>{
      const sA=Math.round(p.tA.reduce((s,x)=>s+x.boom,0)*1000)/1000;
      const sB=Math.round(p.tB.reduce((s,x)=>s+x.boom,0)*1000)/1000;
      const diff=Math.round(Math.abs(sA-sB)*1000)/1000;
      return{...p,sA,sB,diff,ok:diff<=0.05};
    }).sort((a,b)=>a.diff-b.diff);
    setMmResult(pairs);
  };

  const NAV=[
    {key:"dashboard",icon:"📊",label:"Tổng quan"},
    {key:"players",icon:"👥",label:"VĐV"},
    {key:"ranking",icon:"🏆",label:"Xếp hạng"},
    {key:"matchmake",icon:"⚔️",label:"Ghép kèo"},
    {key:"adjust",icon:"⚡",label:"Điều chỉnh"},
    {key:"register",icon:"📝",label:"Đăng ký"},
    {key:"history",icon:"📋",label:"Lịch sử"},
    {key:"rules",icon:"📜",label:"Quy định"},
  ];

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <>
    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,${C.bg} 0%,${C.bg2} 60%,${C.bg3} 100%)`,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif",overflowX:"hidden"}}>
      {/* Ambient glows */}
      <div style={{position:"fixed",top:-150,left:-150,width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,53,0.09) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:-120,right:-120,width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,180,71,0.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>

      {/* ── TOP HEADER ── */}
      <header style={{background:"rgba(13,13,13,0.97)",borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 20px rgba(0,0,0,0.6)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",maxWidth:900,margin:"0 auto"}}>
          {/* Logo */}
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:26,filter:"drop-shadow(0 0 10px rgba(255,107,53,0.7))"}}>🏓</span>
            <div>
              <div style={{fontSize:16,fontWeight:900,letterSpacing:3,background:"linear-gradient(90deg,#FF6B35,#FFB347)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1}}>PICKLEBOOM</div>
              <div style={{fontSize:9,color:C.dim,letterSpacing:1,marginTop:1}}>Đà Nẵng · <span style={{color:dbReady?"#4ADE80":"#FFB347"}}>{dbReady?"● Online":"● Connecting..."}</span></div>
            </div>
          </div>
          {/* Auth */}
          {isAdmin?(
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:10,color:"#FF6B35",fontWeight:700}}>🔐 {auth.user.label}</div>
                <div style={{fontSize:9,color:C.dim}}>Admin</div>
              </div>
              <button onClick={handleLogout} style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.35)",color:"#EF4444",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>Đăng xuất</button>
              <button onClick={()=>{if(window.confirm("Reset toàn bộ dữ liệu về mặc định?"))handleResetData();}} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.dim,borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:11,fontWeight:700}} title="Reset dữ liệu gốc">↺</button>
            </div>
          ):(
            <button onClick={()=>setAuth(a=>({...a,showLogin:true}))} style={{background:"rgba(255,107,53,0.12)",border:`1px solid rgba(255,107,53,0.35)`,color:"#FF6B35",borderRadius:8,padding:"7px 12px",cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:5}}>
              🔑 Đăng nhập
            </button>
          )}
        </div>
      </header>

      {/* ── SYNCING INDICATOR ── */}
      {syncing&&(
        <div style={{position:"fixed",top:56,left:"50%",transform:"translateX(-50%)",zIndex:299,padding:"6px 16px",borderRadius:20,background:"rgba(255,107,53,0.15)",border:"1px solid rgba(255,107,53,0.3)",fontSize:11,color:"#FF6B35",fontWeight:600,display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
          <span style={{display:"inline-block",animation:"spin 1s linear infinite"}}>⟳</span> Đang đồng bộ...
        </div>
      )}

      {/* ── NOTIFICATION ── */}
      {notif&&(
        <div style={{position:"fixed",top:64,left:"50%",transform:"translateX(-50%)",zIndex:300,padding:"10px 20px",borderRadius:20,color:"#fff",fontSize:13,fontWeight:600,boxShadow:"0 8px 24px rgba(0,0,0,0.5)",background:notif.type==="ok"?"#FF6B35":"#EF4444",whiteSpace:"nowrap",maxWidth:"90vw",textAlign:"center"}}>
          {notif.type==="ok"?"✓":"✗"} {notif.msg}
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main style={{maxWidth:900,margin:"0 auto",padding:"16px 12px 90px",position:"relative",zIndex:1}}>

        {/* ════ DASHBOARD ════ */}
        {tab==="dashboard"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{fontSize:18,fontWeight:800,color:C.orange}}>Tổng quan CLB</div>

            {/* Stats 2x2 grid */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[
                {label:"Tổng VĐV",value:stats.total,icon:"👥",color:"#FF6B35"},
                {label:"Điểm TB",value:stats.avg,icon:"⭐",color:"#FFB347"},
                {label:"Nam",value:stats.male,icon:"♂",color:"#60A5FA"},
                {label:"Nữ",value:stats.female,icon:"♀",color:"#F9A8D4"},
              ].map((st,i)=>(
                <Card key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px"}}>
                  <div style={{width:40,height:40,borderRadius:12,background:"rgba(255,107,53,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{st.icon}</div>
                  <div>
                    <div style={{fontSize:24,fontWeight:900,color:st.color,lineHeight:1}}>{st.value}</div>
                    <div style={{fontSize:11,color:C.muted,marginTop:2}}>{st.label}</div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Top 5 tabs */}
            <Card>
              <div style={{display:"flex",gap:0,marginBottom:14,borderRadius:10,overflow:"hidden",border:`1px solid ${C.border}`}}>
                {["male","female"].map(g=>(
                  <button key={g} onClick={()=>setRankGender(g)} style={{flex:1,padding:"9px",border:"none",cursor:"pointer",fontWeight:700,fontSize:13,background:rankGender===g?C.orange:"transparent",color:rankGender===g?"#fff":C.muted,transition:"all 0.2s"}}>
                    {g==="male"?"♂ Top Nam":"♀ Top Nữ"}
                  </button>
                ))}
              </div>
              {(rankGender==="male"?topMale:topFemale).map((p,i)=>(
                <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 4px",borderBottom:i<4?"1px solid rgba(255,107,53,0.08)":"none"}}>
                  <span style={{width:30,textAlign:"center",fontSize:i<3?18:13,flexShrink:0}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}</span>
                  <span style={{flex:1,fontWeight:600,fontSize:14}}>{p.name}</span>
                  <TierChip tier={p.tier}/>
                  <BoomBadge boom={p.boom} tier={p.tier}/>
                </div>
              ))}
            </Card>

            {/* Tier distribution */}
            <Card>
              <SectionTitle>📊 Phân bố Tier</SectionTitle>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {TIERS.map(t=>{
                  const cnt=stats.tc[t]||0;
                  const pct=(cnt/stats.total)*100;
                  return(
                    <div key={t} style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{width:28,fontWeight:800,fontSize:12,color:TIER_COLORS[t],flexShrink:0}}>{t}</span>
                      <div style={{flex:1,height:5,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden"}}>
                        <div style={{width:`${pct}%`,height:"100%",background:TIER_COLORS[t],borderRadius:4}}/>
                      </div>
                      <span style={{width:20,fontSize:11,color:C.muted,textAlign:"right",flexShrink:0}}>{cnt}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* ════ PLAYERS ════ */}
        {tab==="players"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontSize:18,fontWeight:800,color:C.orange}}>VĐV ({filtered.length})</div>
              {isAdmin?(
                <button onClick={()=>setShowAddModal(true)} style={{background:`linear-gradient(90deg,${C.orange},${C.orange2})`,border:"none",color:"#fff",borderRadius:10,padding:"9px 16px",cursor:"pointer",fontSize:13,fontWeight:700,boxShadow:"0 4px 12px rgba(255,107,53,0.35)"}}>+ Thêm</button>
              ):(
                <span style={{fontSize:11,color:C.dim,display:"flex",alignItems:"center",gap:4}}>🔒 Chỉ Admin</span>
              )}
            </div>

            {/* Filters */}
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <input placeholder="🔍 Tìm tên..." value={search} onChange={e=>setSearch(e.target.value)}
                style={{flex:1,minWidth:140,background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 12px",color:C.text,fontSize:14,outline:"none"}}/>
              <select value={filterGender} onChange={e=>setFilterGender(e.target.value)} style={{background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 10px",color:C.text,fontSize:12,outline:"none",cursor:"pointer"}}>
                <option value="all">Tất cả</option><option value="male">Nam</option><option value="female">Nữ</option>
              </select>
              <select value={filterTier} onChange={e=>setFilterTier(e.target.value)} style={{background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 10px",color:C.text,fontSize:12,outline:"none",cursor:"pointer"}}>
                <option value="all">Mọi Tier</option>
                {TIERS.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Player cards — mobile-friendly, no table */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {filtered.map((p,i)=>(
                <Card key={p.id} style={{padding:"12px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    {/* Rank + gender */}
                    <div style={{width:32,height:32,borderRadius:10,background:"rgba(255,107,53,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <span style={{fontSize:14,color:p.gender==="male"?"#60A5FA":"#F9A8D4"}}>{p.gender==="male"?"♂":"♀"}</span>
                    </div>
                    {/* Name + tier */}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                        <span style={{fontWeight:700,fontSize:14,color:C.text}}>{p.name}</span>

                      </div>
                      {p.remark&&(
                        <div style={{fontSize:10,color:"#FFB347",marginTop:3,fontStyle:"italic",display:"flex",alignItems:"center",gap:4}}>
                          <span>📝</span><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.remark}</span>
                        </div>
                      )}
                      <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
                        {isAdmin?(
                          <select value={p.tier} onChange={e=>handleTierChange(p,e.target.value)}
                            style={{background:"transparent",border:`1px solid ${TIER_COLORS[p.tier]}66`,borderRadius:8,padding:"2px 6px",fontSize:11,fontWeight:800,cursor:"pointer",outline:"none",color:TIER_COLORS[p.tier]}}>
                            {TIERS.map(t=><option key={t} value={t}>{t}</option>)}
                          </select>
                        ):(
                          <TierChip tier={p.tier}/>
                        )}
                        <BoomBadge boom={p.boom} tier={p.tier}/>
                      </div>
                    </div>
                    {/* Actions */}
                    {isAdmin?(
                      <div style={{display:"flex",gap:6,flexShrink:0}}>
                        <button onClick={()=>{setAdjModal(p);setAdjForm({type:"",value:0,note:""}); }}
                          style={{background:"rgba(255,107,53,0.12)",border:"1px solid rgba(255,107,53,0.35)",color:C.orange,borderRadius:10,padding:"8px 10px",cursor:"pointer",fontSize:14,fontWeight:700}} title="Điều chỉnh điểm">
                          ⚡
                        </button>
                        <button onClick={()=>{setEditModal(p);setEditForm({name:p.name,tier:p.tier,gender:p.gender,remark:p.remark||""});}}
                          style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.35)",color:"#60A5FA",borderRadius:10,padding:"8px 10px",cursor:"pointer",fontSize:14}} title="Sửa thông tin">
                          ✏️
                        </button>
                        <button onClick={()=>setDeleteConfirm(p)}
                          style={{background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.35)",color:"#EF4444",borderRadius:10,padding:"8px 10px",cursor:"pointer",fontSize:14}} title="Xóa VĐV">
                          🗑️
                        </button>
                      </div>
                    ):(
                      <span style={{fontSize:16,flexShrink:0}}>🔒</span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ════ RANKING ════ */}
        {tab==="ranking"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{fontSize:18,fontWeight:800,color:C.orange}}>Bảng xếp hạng</div>
            <div style={{display:"flex",gap:0,borderRadius:12,overflow:"hidden",border:`1px solid ${C.border}`}}>
              {["male","female"].map(g=>(
                <button key={g} onClick={()=>setRankGender(g)} style={{flex:1,padding:"11px",border:"none",cursor:"pointer",fontWeight:700,fontSize:13,background:rankGender===g?C.orange:"transparent",color:rankGender===g?"#fff":C.muted,transition:"all 0.2s"}}>
                  {g==="male"?"♂ Nam":"♀ Nữ"}
                </button>
              ))}
            </div>
            <Card style={{padding:"8px 12px"}}>
              {[...players[rankGender]].sort((a,b)=>b.boom-a.boom).map((p,i)=>(
                <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 4px",borderBottom:i<players[rankGender].length-1?"1px solid rgba(255,107,53,0.07)":"none"}}>
                  <span style={{width:36,textAlign:"center",fontSize:i<3?18:12,fontWeight:700,flexShrink:0,color:i<3?"#FF6B35":C.dim}}>
                    {i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}
                  </span>
                  <span style={{flex:1,fontWeight:i<3?700:500,fontSize:13}}>{p.name}</span>
                  <TierChip tier={p.tier}/>
                  <span style={{fontSize:15,fontWeight:800,color:i<3?"#FF6B35":C.muted,minWidth:38,textAlign:"right"}}>{p.boom.toFixed(2)}</span>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ════ MATCHMAKE ════ */}
        {tab==="matchmake"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{fontSize:18,fontWeight:800,color:C.orange}}>⚔️ Ghép kèo cân bằng</div>

            {/* Selected slots */}
            <Card>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <SectionTitle>Đội hình ({mmSel.length}/4)</SectionTitle>
                {mmSel.length>0&&<button onClick={()=>{setMmSel([]);setMmResult(null);}} style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.4)",color:"#EF4444",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontSize:11,fontWeight:700}}>Xóa tất cả</button>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                {[0,1,2,3].map(i=>{
                  const p=mmSel[i];
                  return(
                    <div key={i} style={{borderRadius:12,border:p?`2px solid ${TIER_COLORS[p.tier]}66`:"2px dashed rgba(255,107,53,0.2)",padding:"10px 6px",textAlign:"center",background:p?TIER_COLORS[p.tier]+"10":"rgba(255,255,255,0.02)",minHeight:90,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}>
                      {p?(
                        <>
                          <div style={{fontSize:16}}>{p.gender==="male"?"♂":"♀"}</div>
                          <div style={{fontSize:10,fontWeight:700,lineHeight:1.3,color:C.text,textAlign:"center",wordBreak:"break-word"}}>{p.name}</div>
                          <TierChip tier={p.tier}/>
                          <div style={{fontSize:12,fontWeight:800,color:TIER_COLORS[p.tier]}}>{p.boom.toFixed(2)}</div>
                          <button onClick={()=>toggleMm(p)} style={{fontSize:9,background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.3)",color:"#EF4444",borderRadius:6,padding:"2px 6px",cursor:"pointer",marginTop:2}}>✕</button>
                        </>
                      ):(
                        <div style={{color:"rgba(255,107,53,0.25)",fontSize:10}}>VĐV {i+1}</div>
                      )}
                    </div>
                  );
                })}
              </div>
              {mmSel.length===4&&(
                <button onClick={analyzePairing} style={{marginTop:14,width:"100%",background:`linear-gradient(90deg,${C.orange},${C.orange2})`,border:"none",color:"#fff",borderRadius:12,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:800,boxShadow:"0 6px 20px rgba(255,107,53,0.4)"}}>
                  ⚔️ Phân tích kèo
                </button>
              )}
              {mmSel.length<4&&mmSel.length>0&&(
                <div style={{textAlign:"center",marginTop:10,fontSize:12,color:C.dim}}>Chọn thêm {4-mmSel.length} VĐV</div>
              )}
            </Card>

            {/* Results */}
            {mmResult&&(
              <Card>
                <SectionTitle>📊 Kết quả — 3 phương án</SectionTitle>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {mmResult.map((r,i)=>{
                    const color=r.ok?"#4ADE80":r.diff<=0.1?"#FFB347":"#EF4444";
                    const label=r.ok?"🟢 Cân bằng":r.diff<=0.1?"🟡 Chấp nhận":"🔴 Chênh lệch";
                    return(
                      <div key={i} style={{borderRadius:14,border:`2px solid ${i===0?color+"88":"rgba(255,255,255,0.08)"}`,background:i===0?color+"0d":"rgba(255,255,255,0.02)",padding:"14px",position:"relative",overflow:"hidden"}}>
                        {i===0&&<div style={{position:"absolute",top:0,right:0,background:color,color:"#111",fontSize:9,fontWeight:800,padding:"3px 10px",borderRadius:"0 12px 0 10px",letterSpacing:1}}>TỐT NHẤT</div>}
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                          <span style={{fontSize:12,fontWeight:700,color}}>{label}</span>
                          <span style={{fontSize:11,color:C.muted}}>±{r.diff.toFixed(3)}</span>
                        </div>
                        {/* Teams stacked on mobile */}
                        <div style={{display:"flex",flexDirection:"column",gap:8}}>
                          {[{team:r.tA,sum:r.sA,label:"ĐỘI A",col:"#60A5FA"},{team:r.tB,sum:r.sB,label:"ĐỘI B",col:"#F9A8D4"}].map(({team,sum,label:lbl,col})=>(
                            <div key={lbl} style={{background:col+"0d",borderRadius:10,padding:"10px 12px",border:`1px solid ${col}22`}}>
                              <div style={{fontSize:10,fontWeight:800,color:col,marginBottom:6,letterSpacing:0.5}}>{lbl}</div>
                              {team.map(pl=>(
                                <div key={pl.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                                  <span style={{fontSize:12}}>{pl.gender==="male"?"♂":"♀"}</span>
                                  <span style={{flex:1,fontSize:13,fontWeight:600}}>{pl.name}</span>
                                  <span style={{fontSize:12,fontWeight:700,color:TIER_COLORS[pl.tier]}}>{pl.boom.toFixed(2)}</span>
                                </div>
                              ))}
                              <div style={{borderTop:`1px solid ${col}22`,marginTop:6,paddingTop:6,display:"flex",justifyContent:"space-between"}}>
                                <span style={{fontSize:11,color:C.muted}}>Tổng</span>
                                <span style={{fontSize:16,fontWeight:900,color:col}}>{sum.toFixed(3)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{marginTop:12,padding:"8px 12px",background:"rgba(255,255,255,0.03)",borderRadius:8,fontSize:11,color:C.dim,textAlign:"center"}}>
                  Sai số cho phép <span style={{color:"#4ADE80",fontWeight:700}}>≤ 0.05</span>
                </div>
              </Card>
            )}

            {/* Player pool */}
            <Card>
              <SectionTitle>👥 Chọn VĐV ({mmPool.length})</SectionTitle>
              <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
                <input placeholder="🔍 Tìm..." value={mmSearch} onChange={e=>setMmSearch(e.target.value)}
                  style={{flex:1,minWidth:120,background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:10,padding:"9px 12px",color:C.text,fontSize:13,outline:"none"}}/>
                <select value={mmGender} onChange={e=>setMmGender(e.target.value)} style={{background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:10,padding:"9px 10px",color:C.text,fontSize:12,outline:"none",cursor:"pointer"}}>
                  <option value="all">Tất cả</option><option value="male">Nam</option><option value="female">Nữ</option>
                </select>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,maxHeight:380,overflowY:"auto"}}>
                {mmPool.map(p=>{
                  const sel=!!mmSel.find(x=>x.id===p.id);
                  const full=mmSel.length>=4&&!sel;
                  return(
                    <button key={p.id} onClick={()=>!full&&toggleMm(p)}
                      style={{display:"flex",alignItems:"center",gap:8,padding:"10px 10px",borderRadius:10,border:sel?`2px solid ${TIER_COLORS[p.tier]}`:`1px solid rgba(255,255,255,0.07)`,background:sel?TIER_COLORS[p.tier]+"18":"rgba(255,255,255,0.03)",cursor:full?"not-allowed":"pointer",opacity:full?0.4:1,textAlign:"left",transition:"all 0.15s"}}>
                      <span style={{fontSize:14,flexShrink:0}}>{p.gender==="male"?"♂":"♀"}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:sel?"#fff":C.text}}>{p.name}</div>
                        <div style={{display:"flex",gap:5,marginTop:2}}>
                          <span style={{fontSize:10,fontWeight:800,color:TIER_COLORS[p.tier]}}>{p.tier}</span>
                          <span style={{fontSize:10,color:TIER_COLORS[p.tier]}}>{p.boom.toFixed(2)}</span>
                        </div>
                      </div>
                      {sel&&<span style={{color:"#4ADE80",fontSize:16,flexShrink:0}}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* ════ ADJUST ════ */}
        {tab==="adjust"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{fontSize:18,fontWeight:800,color:C.orange}}>Thưởng / Phạt điểm</div>
            {!isAdmin&&(
              <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:14}}>
                <span style={{fontSize:22,flexShrink:0}}>🔒</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#EF4444",marginBottom:4}}>Quyền truy cập bị giới hạn</div>
                  <div style={{fontSize:12,color:C.muted,lineHeight:1.5}}>Chỉ Administrator mới có thể điều chỉnh điểm trình VĐV.</div>
                  <button onClick={()=>setAuth(a=>({...a,showLogin:true}))} style={{marginTop:10,background:"rgba(255,107,53,0.15)",border:`1px solid rgba(255,107,53,0.4)`,color:"#FF6B35",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12,fontWeight:700}}>🔑 Đăng nhập Admin</button>
                </div>
              </div>
            )}
            <Card>
              <SectionTitle>🏆 Thưởng thành tích</SectionTitle>
              {[
                ["🏆 Vô địch Mini Game BOOM","+0.05","#4ADE80"],
                ["🥈 Á quân Mini Game BOOM","+0.02","#86EFAC"],
                ["🏅 Vô/Á Quân Giải 3 PVNA","+0.05/+0.03/+0.02","#FCD34D"],
                ["🎖 Vô/Á Quân Giải CÓ >16 cặp","+0.03/+0.02/+0.01","#FDE68A"],
              ].map(([lbl,adj,col],i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<3?"1px solid rgba(255,255,255,0.05)":"none",gap:8}}>
                  <span style={{fontSize:13,color:C.text,flex:1}}>{lbl}</span>
                  <span style={{fontSize:14,fontWeight:800,color:col,flexShrink:0}}>{adj}</span>
                </div>
              ))}
            </Card>
            <Card>
              <SectionTitle>⚠️ Phạt phong độ kém</SectionTitle>
              {[
                ["✗ 3 lần không qua vòng bảng","-0.05","-0.02"],
                ["✗ 5 lần không vào được bán kết","-0.05","-0.02"],
              ].map(([lbl,m,f],i)=>(
                <div key={i} style={{padding:"10px 0",borderBottom:i<1?"1px solid rgba(255,255,255,0.05)":"none"}}>
                  <div style={{fontSize:12,color:C.text,marginBottom:6}}>{lbl}</div>
                  <div style={{display:"flex",gap:10}}>
                    <span style={{fontSize:13,fontWeight:700,color:"#EF4444"}}>♂ {m}</span>
                    <span style={{fontSize:13,fontWeight:700,color:"#EF4444"}}>♀ {f}</span>
                  </div>
                </div>
              ))}
              <div style={{fontSize:11,color:C.dim,marginTop:8,fontStyle:"italic"}}>Dung sai ±0.05 / cặp</div>
            </Card>
            <Card>
              <SectionTitle>📌 Ghi chú</SectionTitle>
              {[
                "VĐV ngoài hội nhóm: liệt kê nhưng Điểm BOOM là điểm Vàng",
                "Điểm đánh giải nội bộ BOOM = Điểm BOOM - Điểm Đỏ",
                "VĐV tham gia BOOM các season sẽ có điểm BOOM",
                "Mục tiêu: hạ trình hợp lý → ghép kèo cân → chơi vui hơn",
                "Mini game có tài trợ FREE FOOD",
              ].map((n,i)=>(
                <div key={i} style={{display:"flex",gap:8,padding:"6px 0",alignItems:"flex-start"}}>
                  <span style={{color:C.orange,flexShrink:0,marginTop:1}}>◆</span>
                  <span style={{fontSize:12,color:"#D1D5DB",lineHeight:1.5}}>{n}</span>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ════ HISTORY ════ */}
        {tab==="history"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{fontSize:18,fontWeight:800,color:C.orange}}>Lịch sử thay đổi</div>
            {history.length===0?(
              <Card style={{textAlign:"center",padding:"48px 20px"}}>
                <div style={{fontSize:36,marginBottom:10}}>📋</div>
                <div style={{color:C.dim,fontSize:14}}>Chưa có lịch sử thay đổi</div>
              </Card>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {history.map(h=>(
                  <Card key={h.id} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"12px 14px"}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:C.orange,marginTop:5,flexShrink:0}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:10,color:"#FF8C5A",fontWeight:700,letterSpacing:0.5,textTransform:"uppercase"}}>{h.action}</div>
                      <div style={{fontSize:13,fontWeight:700,color:C.text,marginTop:2}}>{h.player}</div>
                      <div style={{fontSize:11,color:C.muted,marginTop:2}}>{h.detail}</div>
                    </div>
                    <div style={{fontSize:10,color:C.dim,whiteSpace:"nowrap",flexShrink:0,paddingTop:2}}>{h.time}</div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════ ĐĂNG KÝ THÀNH VIÊN ════ */}
        {tab==="register"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {/* Public registration form */}
            {!regSubmitted?(
              <Card>
                <div style={{textAlign:"center",marginBottom:20}}>
                  <div style={{fontSize:28,marginBottom:6}}>🏓</div>
                  <div style={{fontSize:18,fontWeight:800,color:C.orange}}>Đăng ký thành viên</div>
                  <div style={{fontSize:12,color:C.muted,marginTop:4}}>Pickleboom Pickleball Club – Đà Nẵng</div>
                </div>
                {[
                  {label:"Họ và tên *",node:<input value={regForm.name} onChange={e=>setRegForm(f=>({...f,name:e.target.value}))} style={MS} placeholder="Nhập họ tên đầy đủ..."/>},
                  {label:"Email *",node:<input value={regForm.email} onChange={e=>setRegForm(f=>({...f,email:e.target.value}))} style={MS} placeholder="example@email.com" type="email"/>},
                  {label:"Điểm trình PVNA *",node:<input value={regForm.pvna} onChange={e=>setRegForm(f=>({...f,pvna:e.target.value}))} style={MS} placeholder="VD: 2.65 hoặc không biết nhập 0"/>},
                  {label:"Giới tính",node:(
                    <div style={{display:"flex",gap:8}}>
                      {["male","female"].map(g=>(
                        <button key={g} onClick={()=>setRegForm(f=>({...f,gender:g}))} style={{flex:1,padding:"10px",borderRadius:10,border:"1px solid",borderColor:regForm.gender===g?C.orange:"rgba(255,255,255,0.1)",background:regForm.gender===g?"rgba(255,107,53,0.15)":"rgba(255,255,255,0.04)",color:regForm.gender===g?C.orange:C.muted,fontWeight:700,cursor:"pointer",fontSize:14}}>
                          {g==="male"?"👨 Nam":"👩 Nữ"}
                        </button>
                      ))}
                    </div>
                  )},
                  {label:"Ghi chú (tuỳ chọn)",node:<input value={regForm.note} onChange={e=>setRegForm(f=>({...f,note:e.target.value}))} style={MS} placeholder="Kinh nghiệm, câu hỏi..."/>},
                ].map(({label,node},i)=>(
                  <div key={i} style={{marginBottom:14}}>
                    <label style={{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:0.5,display:"block",marginBottom:6,textTransform:"uppercase"}}>{label}</label>
                    {node}
                  </div>
                ))}
                <button
                  onClick={handleRegister}
                  disabled={regLoading||!regForm.name.trim()||!regForm.email.trim()||!regForm.pvna.trim()}
                  style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:(!regForm.name.trim()||!regForm.email.trim()||!regForm.pvna.trim())?"rgba(255,255,255,0.08)":`linear-gradient(90deg,${C.orange},${C.orange2})`,color:(!regForm.name.trim()||!regForm.email.trim()||!regForm.pvna.trim())?"#666":"#fff",fontWeight:800,fontSize:15,cursor:"pointer",boxShadow:(!regForm.name.trim()||!regForm.email.trim()||!regForm.pvna.trim())?"none":"0 4px 16px rgba(255,107,53,0.4)",transition:"all 0.2s"}}>
                  {regLoading?"⏳ Đang gửi...":"✅ Gửi đăng ký"}
                </button>
                <div style={{fontSize:11,color:C.dim,textAlign:"center",marginTop:12}}>Sau khi đăng ký, BTC sẽ xem xét và liên hệ qua email</div>
              </Card>
            ):(
              <Card>
                <div style={{textAlign:"center",padding:"20px 0"}}>
                  <div style={{fontSize:48,marginBottom:12}}>🎉</div>
                  <div style={{fontSize:18,fontWeight:800,color:"#4ADE80",marginBottom:8}}>Đăng ký thành công!</div>
                  <div style={{fontSize:13,color:C.muted,marginBottom:20,lineHeight:1.6}}>Cảm ơn bạn đã đăng ký tham gia<br/>BTC sẽ liên hệ qua email trong thời gian sớm nhất</div>
                  <button onClick={()=>setRegSubmitted(false)} style={{padding:"10px 24px",borderRadius:10,border:"none",background:`linear-gradient(90deg,${C.orange},${C.orange2})`,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:14}}>
                    📝 Đăng ký thêm
                  </button>
                </div>
              </Card>
            )}

            {/* Admin: view registrations */}
            {isAdmin&&(
              <Card>
                <SectionTitle>📋 Danh sách đăng ký ({regList.length})</SectionTitle>
                {regList.length===0?(
                  <div style={{textAlign:"center",color:C.dim,padding:"20px 0",fontSize:13}}>Chưa có đơn đăng ký nào</div>
                ):(
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {/* Filter badges */}
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:4}}>
                      {["all","pending","approved","rejected"].map(s=>{
                        const count=s==="all"?regList.length:regList.filter(r=>r.status===s).length;
                        const colors={all:C.orange,pending:"#FBBF24",approved:"#4ADE80",rejected:"#F87171"};
                        return(
                          <span key={s} style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:`${colors[s]}22`,color:colors[s],border:`1px solid ${colors[s]}44`}}>
                            {s==="all"?"Tất cả":s==="pending"?"Chờ duyệt":s==="approved"?"Đã duyệt":"Từ chối"} ({count})
                          </span>
                        );
                      })}
                    </div>
                    {regList.map(reg=>(
                      <div key={reg.id} style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px 14px",border:`1px solid ${reg.status==="approved"?"rgba(74,222,128,0.25)":reg.status==="rejected"?"rgba(248,113,113,0.2)":"rgba(255,255,255,0.08)"}`}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                          <div style={{flex:1}}>
                            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                              <span style={{fontWeight:800,fontSize:14,color:C.text}}>{reg.gender==="male"?"👨":"👩"} {reg.name}</span>
                              <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,fontWeight:700,
                                background:reg.status==="approved"?"rgba(74,222,128,0.15)":reg.status==="rejected"?"rgba(248,113,113,0.15)":"rgba(251,191,36,0.15)",
                                color:reg.status==="approved"?"#4ADE80":reg.status==="rejected"?"#F87171":"#FBBF24"}}>
                                {reg.status==="approved"?"✅ Đã duyệt":reg.status==="rejected"?"❌ Từ chối":"⏳ Chờ duyệt"}
                              </span>
                            </div>
                            <div style={{fontSize:12,color:C.muted,display:"flex",flexWrap:"wrap",gap:"4px 16px"}}>
                              <span>✉️ {reg.email}</span>
                              <span>📊 PVNA: <span style={{color:C.orange,fontWeight:700}}>{reg.pvna}</span></span>
                              {reg.note&&<span>💬 {reg.note}</span>}
                            </div>
                            <div style={{fontSize:10,color:C.dim,marginTop:4}}>🕐 {reg.time}</div>
                          </div>
                          {reg.status==="pending"&&(
                            <div style={{display:"flex",flexDirection:"column",gap:6}}>
                              <button onClick={()=>handleApproveReg(reg)} style={{padding:"6px 12px",borderRadius:8,border:"none",background:"rgba(74,222,128,0.2)",color:"#4ADE80",fontWeight:700,cursor:"pointer",fontSize:12,whiteSpace:"nowrap"}}>✅ Duyệt</button>
                              <button onClick={()=>handleRejectReg(reg)} style={{padding:"6px 12px",borderRadius:8,border:"none",background:"rgba(248,113,113,0.15)",color:"#F87171",fontWeight:700,cursor:"pointer",fontSize:12,whiteSpace:"nowrap"}}>❌ Từ chối</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </div>
        )}

        {/* ════ RULES ════ */}
        {tab==="rules"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{fontSize:18,fontWeight:800,color:C.orange}}>Quy định hệ thống</div>
            <Card>
              <SectionTitle>📊 Bảng quy đổi Tier → Điểm</SectionTitle>
              <div style={{display:"flex",padding:"8px 10px",background:"rgba(255,107,53,0.12)",borderRadius:8,marginBottom:4}}>
                {["Tier","Nam","Nữ"].map((h,i)=><span key={i} style={{flex:1,fontSize:11,fontWeight:800,color:C.orange}}>{h}</span>)}
              </div>
              {[["1+",2.8,2.15],["1-",2.75,"—"],["2++",2.7,"—"],["2+",2.65,2.1],["2",2.1,2.1],["2-",2.05,2.05],["3+",2.55,"—"],["3",2.5,"—"]].map(([tier,m,f],i)=>(
                <div key={tier} style={{display:"flex",padding:"8px 10px",background:i%2===0?"rgba(255,255,255,0.02)":"transparent",borderRadius:6}}>
                  <span style={{flex:1,fontSize:12,fontWeight:800,color:TIER_COLORS[tier]}}>{tier}</span>
                  <span style={{flex:1,fontSize:12,color:C.text}}>{m}</span>
                  <span style={{flex:1,fontSize:12,color:C.text}}>{f}</span>
                </div>
              ))}
            </Card>
            <Card>
              <SectionTitle>🏗 Nền tảng bảng điểm</SectionTitle>
              {[
                ["Điểm trình","Xét theo bảng chia TIER giải BOOM SEASON 4, bổ sung"],
                ["Điều chỉnh","± theo thực lực thi đấu trong BOOM"],
                ["Phạm vi","Nội bộ BOOM"],
                ["Xét lại trình","Cuối mỗi tuần / tháng khi có sự kiện"],
              ].map(([k,v],i)=>(
                <div key={i} style={{padding:"10px 0",borderBottom:i<3?"1px solid rgba(255,107,53,0.08)":"none"}}>
                  <div style={{fontSize:10,color:"#FF8C5A",fontWeight:700,marginBottom:3,letterSpacing:0.5,textTransform:"uppercase"}}>{k}</div>
                  <div style={{fontSize:13,color:"#D1D5DB",lineHeight:1.5}}>{v}</div>
                </div>
              ))}
            </Card>
          </div>
        )}

      </main>

      {/* ── BOTTOM NAV (mobile-first) ── */}
      <nav style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(13,13,13,0.97)",borderTop:`1px solid ${C.border}`,display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom,0px)",boxShadow:"0 -4px 24px rgba(0,0,0,0.5)"}}>
        {NAV.map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)}
            style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"8px 2px 6px",border:"none",background:"transparent",cursor:"pointer",color:tab===t.key?C.orange:C.dim,transition:"all 0.2s",position:"relative"}}>
            {tab===t.key&&<div style={{position:"absolute",top:0,left:"25%",right:"25%",height:2,background:C.orange,borderRadius:2}}/>}
            <span style={{fontSize:18,lineHeight:1}}>{t.icon}</span>
            <span style={{fontSize:9,fontWeight:tab===t.key?700:500,letterSpacing:0.3,whiteSpace:"nowrap"}}>{t.label}</span>
          </button>
        ))}
      </nav>

      {/* ── ADD PLAYER MODAL ── */}
      {showAddModal&&isAdmin&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:400,backdropFilter:"blur(6px)"}} onClick={()=>setShowAddModal(false)}>
          <div style={{background:`linear-gradient(145deg,${C.bg2},${C.bg3})`,border:`1px solid rgba(255,107,53,0.35)`,borderRadius:"20px 20px 0 0",padding:"24px 20px 36px",width:"100%",maxWidth:520,boxShadow:"0 -16px 40px rgba(0,0,0,0.7)"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 20px"}}/>
            <div style={{fontSize:16,fontWeight:800,color:C.orange,marginBottom:18}}>➕ Thêm VĐV mới</div>
            {[
              {label:"Tên VĐV",node:<input value={newPlayer.name} onChange={e=>setNewPlayer(p=>({...p,name:e.target.value}))} style={MS} placeholder="Nhập tên..."/>},
              {label:"Giới tính",node:<select value={newPlayer.gender} onChange={e=>setNewPlayer(p=>({...p,gender:e.target.value}))} style={MS}><option value="male">Nam</option><option value="female">Nữ</option></select>},
              {label:"Tier",node:<select value={newPlayer.tier} onChange={e=>setNewPlayer(p=>({...p,tier:e.target.value}))} style={MS}>{TIERS.map(t=><option key={t} value={t}>Tier {t} — {TIER_BOOM[t]}</option>)}</select>},
              {label:"Ghi chú / Lý do (tuỳ chọn)",node:<input value={newPlayer.remark||""} onChange={e=>setNewPlayer(p=>({...p,remark:e.target.value}))} style={MS} placeholder="VD: +0.05 Vô địch WeekBoom1 21/01"/>},
            ].map(({label,node},i)=>(
              <div key={i} style={{marginBottom:12}}>
                <label style={{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:0.5,display:"block",marginBottom:5,textTransform:"uppercase"}}>{label}</label>
                {node}
              </div>
            ))}
            <div style={{display:"flex",gap:10,marginTop:18}}>
              <button onClick={()=>setShowAddModal(false)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:12,padding:"12px",cursor:"pointer",fontSize:14,fontWeight:600}}>Hủy</button>
              <button onClick={handleAddPlayer} style={{flex:2,background:`linear-gradient(90deg,${C.orange},${C.orange2})`,border:"none",color:"#fff",borderRadius:12,padding:"12px",cursor:"pointer",fontSize:14,fontWeight:800,boxShadow:"0 4px 14px rgba(255,107,53,0.4)"}}>Thêm VĐV</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADJUST MODAL ── */}
      {adjModal&&isAdmin&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:400,backdropFilter:"blur(6px)"}} onClick={()=>setAdjModal(null)}>
          <div style={{background:`linear-gradient(145deg,${C.bg2},${C.bg3})`,border:`1px solid rgba(255,107,53,0.35)`,borderRadius:"20px 20px 0 0",padding:"24px 20px 36px",width:"100%",maxWidth:520,boxShadow:"0 -16px 40px rgba(0,0,0,0.7)"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 20px"}}/>
            <div style={{fontSize:16,fontWeight:800,color:C.orange,marginBottom:14}}>⚡ Điều chỉnh điểm</div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,padding:"12px 14px",background:"rgba(255,107,53,0.08)",borderRadius:12}}>
              <span style={{flex:1,fontWeight:700,fontSize:15}}>{adjModal.name}</span>
              <BoomBadge boom={adjModal.boom} tier={adjModal.tier}/>
            </div>
            {[
              {label:"Chọn nhanh",node:(
                <select value={adjForm.type} onChange={e=>{
                  const pre={"+0.05":0.05,"+0.02":0.02,"+0.03":0.03,"+0.01":0.01,"-0.05":-0.05,"-0.02":-0.02};
                  setAdjForm(f=>({...f,type:e.target.value,value:pre[e.target.value]??f.value}));
                }} style={MS}>
                  <option value="">— Chọn nhanh —</option>
                  <option value="+0.05">🏆 Vô địch Mini Game (+0.05)</option>
                  <option value="+0.02">🥈 Á quân Mini Game (+0.02)</option>
                  <option value="+0.03">🏅 Top 2 PVNA (+0.03)</option>
                  <option value="+0.01">🎖 Top 3 Giải lớn (+0.01)</option>
                  <option value="-0.05">✗ Phạt phong độ Nam (-0.05)</option>
                  <option value="-0.02">✗ Phạt phong độ Nữ (-0.02)</option>
                </select>
              )},
              {label:"Giá trị",node:<input type="number" step="0.01" value={adjForm.value} onChange={e=>setAdjForm(f=>({...f,value:e.target.value}))} style={MS}/>},
              {label:"Ghi chú",node:<input value={adjForm.note} onChange={e=>setAdjForm(f=>({...f,note:e.target.value}))} style={MS} placeholder="Tùy chọn..."/>},
            ].map(({label,node},i)=>(
              <div key={i} style={{marginBottom:12}}>
                <label style={{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:0.5,display:"block",marginBottom:5,textTransform:"uppercase"}}>{label}</label>
                {node}
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",background:"rgba(255,107,53,0.08)",borderRadius:10,marginBottom:16}}>
              <span style={{fontSize:12,color:C.muted}}>Điểm sau điều chỉnh</span>
              <span style={{fontSize:22,fontWeight:900,color:C.orange}}>{(adjModal.boom+parseFloat(adjForm.value||0)).toFixed(3)}</span>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setAdjModal(null)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:12,padding:"12px",cursor:"pointer",fontSize:14,fontWeight:600}}>Hủy</button>
              <button onClick={handleAdjust} style={{flex:2,background:`linear-gradient(90deg,${C.orange},${C.orange2})`,border:"none",color:"#fff",borderRadius:12,padding:"12px",cursor:"pointer",fontSize:14,fontWeight:800,boxShadow:"0 4px 14px rgba(255,107,53,0.4)"}}>Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      {/* ── LOGIN MODAL ── */}
      {auth.showLogin&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:400,backdropFilter:"blur(6px)"}} onClick={()=>setAuth(a=>({...a,showLogin:false,err:""}))}>
          <div style={{background:`linear-gradient(145deg,${C.bg2},${C.bg3})`,border:`1px solid rgba(255,107,53,0.35)`,borderRadius:"20px 20px 0 0",padding:"24px 20px 36px",width:"100%",maxWidth:520,boxShadow:"0 -16px 40px rgba(0,0,0,0.7)"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 20px"}}/>
            <div style={{textAlign:"center",marginBottom:22}}>
              <div style={{fontSize:36,marginBottom:8}}>🔐</div>
              <div style={{fontSize:17,fontWeight:900,color:C.orange}}>Đăng nhập Admin</div>
              <div style={{fontSize:11,color:C.dim,marginTop:4}}>Chỉ quản trị viên được phép chỉnh sửa điểm trình</div>
            </div>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:0.5,display:"block",marginBottom:5,textTransform:"uppercase"}}>Tên đăng nhập</label>
              <input value={auth.u} onChange={e=>setAuth(a=>({...a,u:e.target.value,err:""}))}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={MS} placeholder="Nhập tên đăng nhập..."/>
            </div>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:0.5,display:"block",marginBottom:5,textTransform:"uppercase"}}>Mật khẩu</label>
              <input type="password" value={auth.p} onChange={e=>setAuth(a=>({...a,p:e.target.value,err:""}))}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={MS} placeholder="Nhập mật khẩu..."/>
            </div>
            {auth.err&&(
              <div style={{background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#EF4444",marginBottom:12,textAlign:"center"}}>✕ {auth.err}</div>
            )}
            <div style={{display:"flex",gap:10,marginTop:16}}>
              <button onClick={()=>setAuth(a=>({...a,showLogin:false,err:"",u:"",p:""}))} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:12,padding:"12px",cursor:"pointer",fontSize:14,fontWeight:600}}>Hủy</button>
              <button onClick={handleLogin} style={{flex:2,background:`linear-gradient(90deg,${C.orange},${C.orange2})`,border:"none",color:"#fff",borderRadius:12,padding:"12px",cursor:"pointer",fontSize:14,fontWeight:800,boxShadow:"0 4px 14px rgba(255,107,53,0.4)"}}>🔑 Đăng nhập</button>
            </div>
            <div style={{marginTop:14,fontSize:11,color:C.dim,textAlign:"center"}}>Liên hệ quản trị viên CLB để được cấp tài khoản</div>
          </div>
        </div>
      )}

      {/* ── EDIT PLAYER MODAL ── */}
      {editModal&&isAdmin&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:400,backdropFilter:"blur(6px)"}} onClick={()=>setEditModal(null)}>
          <div style={{background:`linear-gradient(145deg,${C.bg2},${C.bg3})`,border:"1px solid rgba(96,165,250,0.35)",borderRadius:"20px 20px 0 0",padding:"24px 20px 36px",width:"100%",maxWidth:520,boxShadow:"0 -16px 40px rgba(0,0,0,0.7)"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 20px"}}/>
            <div style={{fontSize:16,fontWeight:800,color:"#60A5FA",marginBottom:18}}>✏️ Sửa thông tin VĐV</div>
            <div style={{padding:"10px 14px",background:"rgba(96,165,250,0.08)",borderRadius:10,marginBottom:16,fontSize:13,color:C.muted}}>
              Đang sửa: <span style={{color:C.text,fontWeight:700}}>{editModal.name}</span>
            </div>
            {[
              {label:"Tên VĐV",node:<input value={editForm.name} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))} style={MS} placeholder="Nhập tên..."/>},
              {label:"Giới tính",node:<select value={editForm.gender} onChange={e=>setEditForm(f=>({...f,gender:e.target.value}))} style={MS}><option value="male">Nam</option><option value="female">Nữ</option></select>},
              {label:"Tier",node:<select value={editForm.tier} onChange={e=>setEditForm(f=>({...f,tier:e.target.value}))} style={MS}>{TIERS.map(t=><option key={t} value={t}>Tier {t} — {TIER_BOOM[t]}</option>)}</select>},
              {label:"Ghi chú / Lý do thay đổi",node:<input value={editForm.remark||""} onChange={e=>setEditForm(f=>({...f,remark:e.target.value}))} style={MS} placeholder="VD: +0.03 Á Quân WeekBoom2 31/01"/>},
            ].map(({label,node},i)=>(
              <div key={i} style={{marginBottom:12}}>
                <label style={{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:0.5,display:"block",marginBottom:5,textTransform:"uppercase"}}>{label}</label>
                {node}
              </div>
            ))}
            <div style={{display:"flex",gap:10,marginTop:18}}>
              <button onClick={()=>setEditModal(null)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:12,padding:"12px",cursor:"pointer",fontSize:14,fontWeight:600}}>Hủy</button>
              <button onClick={handleEditPlayer} style={{flex:2,background:"linear-gradient(90deg,#60A5FA,#3B82F6)",border:"none",color:"#fff",borderRadius:12,padding:"12px",cursor:"pointer",fontSize:14,fontWeight:800,boxShadow:"0 4px 14px rgba(96,165,250,0.35)"}}>💾 Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteConfirm&&isAdmin&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400,backdropFilter:"blur(6px)",padding:"20px"}} onClick={()=>setDeleteConfirm(null)}>
          <div style={{background:`linear-gradient(145deg,${C.bg2},${C.bg3})`,border:"1px solid rgba(239,68,68,0.4)",borderRadius:20,padding:"28px 24px",width:"100%",maxWidth:380,boxShadow:"0 24px 60px rgba(0,0,0,0.7)",textAlign:"center"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:44,marginBottom:14}}>🗑️</div>
            <div style={{fontSize:17,fontWeight:800,color:"#EF4444",marginBottom:8}}>Xóa VĐV?</div>
            <div style={{fontSize:14,color:C.muted,marginBottom:6,lineHeight:1.5}}>
              Bạn có chắc muốn xóa
            </div>
            <div style={{fontSize:18,fontWeight:800,color:C.text,marginBottom:4}}>{deleteConfirm.name}</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:20}}>
              <TierChip tier={deleteConfirm.tier}/>
              <BoomBadge boom={deleteConfirm.boom} tier={deleteConfirm.tier}/>
              <span style={{fontSize:13,color:deleteConfirm.gender==="male"?"#60A5FA":"#F9A8D4"}}>{deleteConfirm.gender==="male"?"♂ Nam":"♀ Nữ"}</span>
            </div>
            <div style={{padding:"10px 14px",background:"rgba(239,68,68,0.08)",borderRadius:10,fontSize:12,color:"#EF4444",marginBottom:20}}>
              ⚠️ Hành động này không thể hoàn tác!
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setDeleteConfirm(null)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:12,padding:"12px",cursor:"pointer",fontSize:14,fontWeight:600}}>Hủy</button>
              <button onClick={()=>handleDeletePlayer(deleteConfirm)} style={{flex:1,background:"linear-gradient(90deg,#EF4444,#DC2626)",border:"none",color:"#fff",borderRadius:12,padding:"12px",cursor:"pointer",fontSize:14,fontWeight:800,boxShadow:"0 4px 14px rgba(239,68,68,0.4)"}}>Xóa</button>
            </div>
          </div>
        </div>
      )}

    </div>
    </>
  );
}


