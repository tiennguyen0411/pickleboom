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
  {username:"admin",    password:"pickleboom@2026", label:"Administrator", role:"admin"},
  {username:"hahoang",  password:"mod@hahoang",     label:"Ha Hoang",      role:"mod"},
  {username:"viettan",  password:"mod@viettan",     label:"Viết Tân",      role:"mod"},
];

// Role permission map
const ROLE_PERMISSIONS = {
  admin: {
    label:"Administrator",
    color:"#FF6B35",
    badge:"👑 Admin",
    canEditPlayers: true,
    canDeletePlayers: true,
    canAddPlayers: true,
    canAdjustScore: true,
    canCreateTournament: true,
    canManageTournament: true,
    canApproveReg: true,
    canResetData: true,
    canManageRoles: true,
  },
  mod: {
    label:"Moderator",
    color:"#60A5FA",
    badge:"🛡 Mod",
    canEditPlayers: false,
    canDeletePlayers: false,
    canAddPlayers: false,
    canAdjustScore: true,
    canCreateTournament: true,
    canManageTournament: true,
    canApproveReg: false,
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
  orange:"#FF6B35",orange2:"#FF8C5A",bg:"#111",bg2:"#181818",bg3:"#222",
  border:"rgba(255,107,53,0.2)",text:"#E5E7EB",muted:"#9CA3AF",dim:"#4B5563",
};

// ─── Reusable tiny components ────────────────────────────────────────────────
function TierChip({tier}){
  return <span style={{fontSize:10,padding:"2px 7px",borderRadius:20,fontWeight:800,border:"1px solid "+TIER_COLORS[tier]+"55",background:TIER_COLORS[tier]+"18",color:TIER_COLORS[tier],flexShrink:0}}>{tier}</span>;
}
function BoomBadge({boom,tier}){
  return <span style={{padding:"3px 10px",borderRadius:20,fontSize:13,fontWeight:800,color:TIER_COLORS[tier],background:TIER_COLORS[tier]+"1a",border:"1px solid "+TIER_COLORS[tier]+"33"}}>{boom.toFixed(2)}</span>;
}
function Card({children,style={}}){
  return <div style={{background:"rgba(255,255,255,0.028)",border:"1px solid "+C.border,borderRadius:18,padding:16,...style}}>{children}</div>;
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
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ldmdhdXhraWxkeGRycW5waG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMzYzOTUsImV4cCI6MjA4ODcxMjM5NX0.SMw09iIB6-3kaEjzXrxF7tP8DsN375linNZPxX1B2kc";

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
    console.error(`[sbFetch] ${options.method||"GET"} ${path} → ${res.status}:`, err);
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
  const [regForm,setRegForm]=useState({name:"",email:"",pvna:"",gender:"male",note:""});
  const [regList,setRegList]=useState([]);
  const [regSubmitted,setRegSubmitted]=useState(false);
  const [regLoading,setRegLoading]=useState(false);
  const [tournaments,setTournaments]=useState([]);
  const [showTourModal,setShowTourModal]=useState(false);
  const [tourForm,setTourForm]=useState({name:"",date:"",format:"double",rounds:"1",note:"",pin:"",bestOf:"3"});
  const [activeTour,setActiveTour]=useState(null);
  const [showMatchModal,setShowMatchModal]=useState(false);
  const [matchForm,setMatchForm]=useState({p1:"",p2:"",p3:"",p4:"",score1:"",score2:"",round:"1"});
  const [viewTour,setViewTour]=useState(null);
  const [playerHistoryView,setPlayerHistoryView]=useState(null);
  const [tourRegForm,setTourRegForm]=useState({tourId:"",playerName:"",contact:"",content:"single",partner:"",note:""});
  const [tourRegSubmitted,setTourRegSubmitted]=useState(false);
  const [showTourRegAdmin,setShowTourRegAdmin]=useState(null); // tourId being managed
  // ── Referee mode state ──
  const [refMode,setRefMode]=useState(false); // fullscreen referee UI
  const [refPin,setRefPin]=useState("");
  const [refPinInput,setRefPinInput]=useState("");
  const [refPinErr,setRefPinErr]=useState("");
  const [refTour,setRefTour]=useState(null); // tournament unlocked by PIN
  const [refMatch,setRefMatch]=useState(null); // match being scored {id,team1,team2,round,format}
  const [refGames,setRefGames]=useState([]); // [{g1t1,g1t2},{g2t1,g2t2},...] each game score
  const [refConfirmed,setRefConfirmed]=useState(false);

  // ── Load data from Supabase ──
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
        // Only seed if truly empty (not a parse error)
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
    if(found){
      sessionStorage.setItem("pb_auth", JSON.stringify({loggedIn:true,user:found}));
      setAuth(a=>({...a,loggedIn:true,user:found,showLogin:false,err:"",u:"",p:""}));
      showNotif("Đăng nhập thành công");
    }
    else setAuth(a=>({...a,err:"Sai tên đăng nhập hoặc mật khẩu"}));
  };
  const handleLogout=()=>{sessionStorage.removeItem("pb_auth");setAuth({loggedIn:false,user:null,showLogin:false,u:"",p:"",err:""});showNotif("Đã đăng xuất");};

  const handleRegister=async()=>{
    if(!regForm.name.trim()||!regForm.email.trim()||!regForm.pvna.trim())return;
    setRegLoading(true);
    const entry={id:Date.now(),name:regForm.name.trim(),email:regForm.email.trim(),pvna:regForm.pvna.trim(),gender:regForm.gender,note:regForm.note.trim(),time:new Date().toLocaleString("vi-VN"),status:"pending"};
    setRegList(prev=>[entry,...prev]);
    try{await sbFetch("registrations",{method:"POST",headers:{"Prefer":"return=minimal"},body:JSON.stringify(entry)});}catch(e){console.error("reg:",e);}
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

  // ── Tournament handlers ──
  const handleCreateTour = async () => {
    if(!tourForm.name.trim()||!tourForm.date.trim()) return;
    const id = Date.now();
    const pin = tourForm.pin.trim() || Math.floor(1000+Math.random()*9000).toString();
    const tour = {id, name:tourForm.name.trim(), date:tourForm.date, format:tourForm.format, rounds:parseInt(tourForm.rounds)||1, note:tourForm.note.trim(), matches:[], status:"active", created:new Date().toLocaleString("vi-VN"), pin, bestOf:parseInt(tourForm.bestOf)||3};
    setTournaments(prev=>[tour,...prev]);
    setShowTourModal(false);
    setTourForm({name:"",date:"",format:"double",rounds:"1",note:"",pin:"",bestOf:"3"});
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

  // Compute per-player tournament stats
  const getPlayerStats = (playerName) => {
    let wins=0, losses=0, totalMatches=0, tourList=[];
    tournaments.forEach(tour=>{
      let inTour=false;
      (tour.matches||[]).forEach(m=>{
        const inT1 = m.team1.includes(playerName);
        const inT2 = m.team2.includes(playerName);
        if(!inT1&&!inT2) return;
        inTour=true; totalMatches++;
        if(inT1&&m.score1>m.score2) wins++;
        else if(inT2&&m.score2>m.score1) wins++;
        else losses++;
      });
      if(inTour) tourList.push(tour.name);
    });
    return {wins, losses, totalMatches, tourList:[...new Set(tourList)]};
  };

  // ── Tournament Registration handlers ──
  const handleTourRegister = async () => {
    const {tourId,playerName,contact,content,partner,note} = tourRegForm;
    if(!tourId||!playerName||!contact) return;
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
      await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({tourRegs:JSON.stringify(updatedRegs)})});
    } catch(e){console.error(e);}
  };

  const handleTourRegApprove = async (tour, regId) => {
    const updatedRegs = (tour.tourRegs||[]).map(r=>r.id===regId?{...r,status:"approved"}:r);
    const updatedTour = {...tour, tourRegs: updatedRegs};
    setTournaments(prev=>prev.map(t=>t.id===tour.id?updatedTour:t));
    if(activeTour?.id===tour.id) setActiveTour(updatedTour);
    if(showTourRegAdmin?.id===tour.id) setShowTourRegAdmin(updatedTour);
    showNotif("Đã duyệt đăng ký");
    try { await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({tourRegs:JSON.stringify(updatedRegs)})}); } catch(e){console.error(e);}
  };

  const handleTourRegReject = async (tour, regId) => {
    const updatedRegs = (tour.tourRegs||[]).map(r=>r.id===regId?{...r,status:"rejected"}:r);
    const updatedTour = {...tour, tourRegs: updatedRegs};
    setTournaments(prev=>prev.map(t=>t.id===tour.id?updatedTour:t));
    if(activeTour?.id===tour.id) setActiveTour(updatedTour);
    if(showTourRegAdmin?.id===tour.id) setShowTourRegAdmin(updatedTour);
    showNotif("Đã từ chối đăng ký","err");
    try { await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({tourRegs:JSON.stringify(updatedRegs)})}); } catch(e){console.error(e);}
  };

  // ── Referee handlers ──
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
    // Calculate total score from games
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
    // Update or add match in tournament
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
    {key:"dashboard",icon:"📊",label:"Tổng quan"},
    {key:"players",icon:"👥",label:"VĐV"},
    {key:"ranking",icon:"🏆",label:"Xếp hạng"},
    {key:"tournament",icon:"🏅",label:"Giải đấu"},
    {key:"roles",icon:"🔐",label:"Phân quyền"},
    {key:"adjust",icon:"⚡",label:"Điều chỉnh"},
    {key:"register",icon:"📝",label:"Đăng ký"},
    {key:"history",icon:"📋",label:"Lịch sử"},
    {key:"rules",icon:"📜",label:"Quy định"},
  ];

  // ─── RENDER ────────────────────────────────────────────────────────────────
  useEffect(()=>{
    const el=document.createElement("style");
    el.textContent="@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}";
    document.head.appendChild(el);
    return()=>document.head.removeChild(el);
  },[]);

  return (
    <>
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#111 0%,#181818 60%,#222 100%)",color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif",overflowX:"hidden"}}>
      {/* Ambient glows */}
      <div style={{position:"fixed",top:-150,left:-150,width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,53,0.09) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:-120,right:-120,width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,180,71,0.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>

      {/* ── TOP HEADER ── */}
      <header style={{background:"rgba(13,13,13,0.97)",borderBottom:"1px solid "+C.border,position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 20px rgba(0,0,0,0.6)"}}>
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
                <div style={{fontSize:10,color:ROLE_PERMISSIONS[userRole]?.color||"#FF6B35",fontWeight:700}}>{ROLE_PERMISSIONS[userRole]?.badge||"🔐"} {auth.user.label}</div>
                <div style={{fontSize:9,color:C.dim}}>Admin</div>
              </div>
              <button onClick={handleLogout} style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.35)",color:"#EF4444",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>Đăng xuất</button>
              <button onClick={()=>{if(can("canResetData")&&window.confirm("Reset toàn bộ dữ liệu về mặc định?"))handleResetData();}} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.dim,borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:11,fontWeight:700}} title="Reset dữ liệu gốc">↺</button>
            </div>
          ):(
<div style={{display:"flex",gap:6}}>
              <button onClick={()=>{setRefMode(true);setRefTour(null);setRefPinInput("");setRefPinErr("");}} style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.35)",color:"#60A5FA",borderRadius:8,padding:"7px 10px",cursor:"pointer",fontSize:12,fontWeight:700}}>
                🏳️ Trọng tài
              </button>
              <button onClick={()=>setAuth(a=>({...a,showLogin:true}))} style={{background:"rgba(255,107,53,0.12)",border:"1px solid rgba(255,107,53,0.35)",color:"#FF6B35",borderRadius:8,padding:"7px 12px",cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:5}}>
                🔑 Đăng nhập
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── SYNCING / RELOAD ── */}
      {syncing?(
        <div style={{position:"fixed",top:56,left:"50%",transform:"translateX(-50%)",zIndex:299,padding:"6px 16px",borderRadius:20,background:"rgba(255,107,53,0.15)",border:"1px solid rgba(255,107,53,0.3)",fontSize:11,color:"#FF6B35",fontWeight:600,display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
          <span style={{display:"inline-block",animation:"spin 1s linear infinite"}}>⟳</span> Đang đồng bộ...
        </div>
      ):(
        <div style={{position:"fixed",top:56,right:12,zIndex:299}}>
          <button onClick={loadFromDB} title="Tải lại dữ liệu từ server" style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:20,padding:"5px 12px",cursor:"pointer",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
            🔄 Tải lại
          </button>
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
              <div style={{display:"flex",gap:0,marginBottom:14,borderRadius:10,overflow:"hidden",border:"1px solid "+C.border}}>
                {["male","female"].map(g=>(
                  <button key={g} onClick={()=>setRankGender(g)} style={{flex:1,padding:"9px",border:"none",cursor:"pointer",fontWeight:700,fontSize:13,background:rankGender===g?C.orange:"transparent",color:rankGender===g?"#fff":C.muted,transition:"all 0.2s"}}>
                    {g==="male"?"♂ Top Nam":"♀ Top Nữ"}
                  </button>
                ))}
              </div>
              {(rankGender==="male"?topMale:topFemale).map((p,i)=>(
                <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 4px",borderBottom:i<4?"1px solid rgba(255,107,53,0.08)":"none"}}>
                  <span style={{width:30,textAlign:"center",fontSize:i<3?18:13,flexShrink:0}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":"#"+(i+1)}</span>
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

        {/* ════ PLAYERS ════ */}
        {tab==="players"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontSize:18,fontWeight:800,color:C.orange}}>VĐV ({filtered.length})</div>
              {isAdmin?(
                can("canAddPlayers")
                  ? <button onClick={()=>setShowAddModal(true)} style={{background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"9px 16px",cursor:"pointer",fontSize:13,fontWeight:700,boxShadow:"0 4px 12px rgba(255,107,53,0.35)"}}>+ Thêm</button>
                  : null
              ):(
                <span style={{fontSize:11,color:C.dim,display:"flex",alignItems:"center",gap:4}}>🔒 Chỉ Admin</span>
              )}
            </div>

            {/* Filters */}
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <input placeholder="🔍 Tìm tên..." value={search} onChange={e=>setSearch(e.target.value)}
                style={{flex:1,minWidth:140,background:"rgba(255,255,255,0.05)",border:"1px solid "+C.border,borderRadius:10,padding:"10px 12px",color:C.text,fontSize:14,outline:"none"}}/>
              <select value={filterGender} onChange={e=>setFilterGender(e.target.value)} style={{background:"rgba(255,255,255,0.05)",border:"1px solid "+C.border,borderRadius:10,padding:"10px 10px",color:C.text,fontSize:12,outline:"none",cursor:"pointer"}}>
                <option value="all">Tất cả</option><option value="male">Nam</option><option value="female">Nữ</option>
              </select>
              <select value={filterTier} onChange={e=>setFilterTier(e.target.value)} style={{background:"rgba(255,255,255,0.05)",border:"1px solid "+C.border,borderRadius:10,padding:"10px 10px",color:C.text,fontSize:12,outline:"none",cursor:"pointer"}}>
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
                        {can("canEditPlayers")?(
                          <select value={p.tier} onChange={e=>handleTierChange(p,e.target.value)}
                            style={{background:"transparent",border:"1px solid "+TIER_COLORS[p.tier]+"66",borderRadius:8,padding:"2px 6px",fontSize:11,fontWeight:800,cursor:"pointer",outline:"none",color:TIER_COLORS[p.tier]}}>
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
                        {can("canAdjustScore")&&(
                          <button onClick={()=>{setAdjModal(p);setAdjForm({type:"",value:0,note:""}); }}
                            style={{background:"rgba(255,107,53,0.12)",border:"1px solid rgba(255,107,53,0.35)",color:C.orange,borderRadius:10,padding:"8px 10px",cursor:"pointer",fontSize:14,fontWeight:700}} title="Điều chỉnh điểm">
                            ⚡
                          </button>
                        )}
                        {can("canEditPlayers")&&(
                          <button onClick={()=>{setEditModal(p);setEditForm({name:p.name,tier:p.tier,gender:p.gender,remark:p.remark||""});}}
                            style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.35)",color:"#60A5FA",borderRadius:10,padding:"8px 10px",cursor:"pointer",fontSize:14}} title="Sửa thông tin">
                            ✏️
                          </button>
                        )}
                        {can("canDeletePlayers")&&(
                          <button onClick={()=>setDeleteConfirm(p)}
                            style={{background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.35)",color:"#EF4444",borderRadius:10,padding:"8px 10px",cursor:"pointer",fontSize:14}} title="Xóa VĐV">
                            🗑️
                          </button>
                        )}
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
            <div style={{display:"flex",gap:0,borderRadius:12,overflow:"hidden",border:"1px solid "+C.border}}>
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
                    {i===0?"🥇":i===1?"🥈":i===2?"🥉":"#"+(i+1)}
                  </span>
                  <span style={{flex:1,fontWeight:i<3?700:500,fontSize:13}}>{p.name}</span>
                  <TierChip tier={p.tier}/>
                  <span style={{fontSize:15,fontWeight:800,color:i<3?"#FF6B35":C.muted,minWidth:38,textAlign:"right"}}>{p.boom.toFixed(2)}</span>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ════ ADJUST ════ */}
        {tab==="adjust"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{fontSize:18,fontWeight:800,color:C.orange}}>Thưởng / Phạt điểm</div>
            {!can("canAdjustScore")&&(
              <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:14}}>
                <span style={{fontSize:22,flexShrink:0}}>🔒</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#EF4444",marginBottom:4}}>Quyền truy cập bị giới hạn</div>
                  <div style={{fontSize:12,color:C.muted,lineHeight:1.5}}>Cần quyền Admin hoặc Moderator để điều chỉnh điểm trình VĐV.</div>
                  <button onClick={()=>setAuth(a=>({...a,showLogin:true}))} style={{marginTop:10,background:"rgba(255,107,53,0.15)",border:"1px solid rgba(255,107,53,0.4)",color:"#FF6B35",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12,fontWeight:700}}>🔑 Đăng nhập</button>
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

        {/* ════ PHÂN QUYỀN ════ */}
        {tab==="roles"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{fontSize:18,fontWeight:800,color:C.orange}}>🔐 Phân quyền hệ thống</div>

            {/* Role cards */}
            {[
              {role:"admin", icon:"👑", color:"#FF6B35", bg:"rgba(255,107,53,0.08)", border:"rgba(255,107,53,0.25)",
                perms:[
                  ["✅","Quản lý VĐV","Thêm / sửa / xóa vận động viên"],
                  ["✅","Chỉnh điểm trình","Điều chỉnh điểm BOOM từng VĐV"],
                  ["✅","Quản lý giải đấu","Tạo, cập nhật, kết thúc giải đấu"],
                  ["✅","Duyệt đăng ký","Duyệt / từ chối đăng ký thành viên & giải đấu"],
                  ["✅","Reset dữ liệu","Reset toàn bộ dữ liệu về mặc định"],
                  ["✅","Phân quyền","Toàn quyền quản lý hệ thống"],
                ]
              },
              {role:"mod", icon:"🛡", color:"#60A5FA", bg:"rgba(96,165,250,0.08)", border:"rgba(96,165,250,0.25)",
                perms:[
                  ["❌","Quản lý VĐV","Không thêm / sửa / xóa VĐV"],
                  ["✅","Chỉnh điểm trình","Được điều chỉnh điểm BOOM"],
                  ["✅","Quản lý giải đấu","Được tạo và cập nhật giải đấu"],
                  ["❌","Duyệt đăng ký","Không duyệt đăng ký thành viên"],
                  ["❌","Reset dữ liệu","Không được reset hệ thống"],
                  ["❌","Phân quyền","Không quản lý tài khoản"],
                ]
              },
            ].map(({role,icon,color,bg,border,perms})=>(
              <Card key={role} style={{border:"1px solid "+border}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                  <div style={{width:40,height:40,borderRadius:12,background:bg,border:"1px solid "+border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{icon}</div>
                  <div>
                    <div style={{fontWeight:800,fontSize:15,color}}>{ROLE_PERMISSIONS[role].label}</div>
                    <div style={{fontSize:11,color:C.muted}}>Role: <code style={{background:"rgba(255,255,255,0.07)",padding:"1px 6px",borderRadius:4,color}}>{role}</code></div>
                  </div>
                  {userRole===role&&(
                    <span style={{marginLeft:"auto",fontSize:10,padding:"3px 10px",borderRadius:20,background:color+"22",color,border:"1px solid "+color+"44",fontWeight:700}}>● Đang đăng nhập</span>
                  )}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {perms.map(([icon2,label,desc],i)=>(
                    <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 10px",borderRadius:10,background:icon2==="✅"?"rgba(74,222,128,0.05)":"rgba(255,255,255,0.02)",border:"1px solid "+(icon2==="✅"?"rgba(74,222,128,0.12)":"rgba(255,255,255,0.06)")}}>
                      <span style={{fontSize:14,flexShrink:0}}>{icon2}</span>
                      <div>
                        <div style={{fontSize:12,fontWeight:700,color:icon2==="✅"?"#E5E7EB":C.dim}}>{label}</div>
                        <div style={{fontSize:11,color:C.dim,marginTop:1}}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}

            {/* Account list - visible to all logged in */}
            {isAdmin&&can("canManageRoles")&&(
              <Card>
                <SectionTitle>👤 Danh sách tài khoản</SectionTitle>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {ADMIN_CREDENTIALS.map((acc,i)=>{
                    const rp = ROLE_PERMISSIONS[acc.role];
                    return(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"rgba(255,255,255,0.04)",borderRadius:12,border:"1px solid rgba(255,255,255,0.08)"}}>
                        <div style={{width:36,height:36,borderRadius:10,background:rp.color+"22",border:"1px solid "+rp.color+"44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                          {acc.role==="admin"?"👑":"🛡"}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:700,fontSize:13,color:C.text}}>{acc.label}</div>
                          <div style={{fontSize:11,color:C.muted,display:"flex",gap:10,flexWrap:"wrap",marginTop:2}}>
                            <span>👤 {acc.username}</span>
                            <span style={{color:rp.color,fontWeight:600}}>{rp.badge}</span>
                          </div>
                        </div>
                        {auth.user?.username===acc.username&&(
                          <span style={{fontSize:10,padding:"3px 8px",borderRadius:20,background:"rgba(74,222,128,0.12)",color:"#4ADE80",fontWeight:700,border:"1px solid rgba(74,222,128,0.25)"}}>● Online</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div style={{marginTop:12,padding:"10px 14px",background:"rgba(255,107,53,0.06)",borderRadius:10,border:"1px solid rgba(255,107,53,0.15)"}}>
                  <div style={{fontSize:11,color:C.muted,lineHeight:1.6}}>
                    💡 Để thêm/sửa tài khoản, liên hệ developer cập nhật trong file <code style={{background:"rgba(255,255,255,0.07)",padding:"1px 5px",borderRadius:4,color:C.orange}}>ADMIN_CREDENTIALS</code>
                  </div>
                </div>
              </Card>
            )}

            {/* Not logged in */}
            {!isAdmin&&(
              <Card>
                <div style={{textAlign:"center",padding:"20px 0"}}>
                  <div style={{fontSize:36,marginBottom:10}}>🔒</div>
                  <div style={{fontSize:14,fontWeight:700,color:"#EF4444",marginBottom:6}}>Cần đăng nhập để xem thông tin phân quyền</div>
                  <button onClick={()=>setAuth(a=>({...a,showLogin:true}))} style={{padding:"10px 24px",borderRadius:10,border:"none",background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:14}}>
                    🔑 Đăng nhập
                  </button>
                </div>
              </Card>
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
                  style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:(!regForm.name.trim()||!regForm.email.trim()||!regForm.pvna.trim())?"rgba(255,255,255,0.08)":"linear-gradient(90deg,#FF6B35,#FF8C5A)",color:(!regForm.name.trim()||!regForm.email.trim()||!regForm.pvna.trim())?"#666":"#fff",fontWeight:800,fontSize:15,cursor:"pointer",boxShadow:(!regForm.name.trim()||!regForm.email.trim()||!regForm.pvna.trim())?"none":"0 4px 16px rgba(255,107,53,0.4)",transition:"all 0.2s"}}>
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
                  <button onClick={()=>setRegSubmitted(false)} style={{padding:"10px 24px",borderRadius:10,border:"none",background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:14}}>
                    📝 Đăng ký thêm
                  </button>
                </div>
              </Card>
            )}

            {/* Admin: view registrations */}
            {can("canApproveReg")&&(
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
                          <span key={s} style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:colors[s]+"22",color:colors[s],border:"1px solid "+colors[s]+"44"}}>
                            {s==="all"?"Tất cả":s==="pending"?"Chờ duyệt":s==="approved"?"Đã duyệt":"Từ chối"} ({count})
                          </span>
                        );
                      })}
                    </div>
                    {regList.map(reg=>(
                      <div key={reg.id} style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px 14px",border:"1px solid "+(reg.status==="approved"?"rgba(74,222,128,0.25)":reg.status==="rejected"?"rgba(248,113,113,0.2)":"rgba(255,255,255,0.08)")}}>
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

        {/* ════ GIẢI ĐẤU ════ */}
        {tab==="tournament"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>

            {/* ── Header ── */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
              <div style={{fontSize:18,fontWeight:800,color:C.orange}}>🏅 Giải đấu</div>
              {can("canCreateTournament")&&(
                <button onClick={()=>setShowTourModal(true)}
                  style={{padding:"10px 18px",borderRadius:12,border:"none",background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",color:"#fff",fontWeight:800,fontSize:13,cursor:"pointer",boxShadow:"0 4px 12px rgba(255,107,53,0.35)",display:"flex",alignItems:"center",gap:6}}>
                  + Tạo giải
                </button>
              )}
            </div>

            {/* ── Tournament cards ── */}
            {tournaments.length===0?(
              <Card style={{padding:"40px 16px",textAlign:"center"}}>
                <div style={{fontSize:48,marginBottom:12}}>🏅</div>
                <div style={{fontSize:15,fontWeight:700,color:C.muted,marginBottom:6}}>Chưa có giải đấu nào</div>
                {can("canCreateTournament")&&<div style={{fontSize:12,color:C.dim}}>Nhấn "+ Tạo giải" để bắt đầu</div>}
              </Card>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {tournaments.map(tour=>{
                  const matchCount=(tour.matches||[]).length;
                  const confirmed=(tour.matches||[]).filter(m=>m.confirmed).length;
                  const isActive=tour.status==="active";
                  return(
                    <div key={tour.id} style={{background:"rgba(255,255,255,0.028)",border:"1px solid "+(isActive?"rgba(74,222,128,0.2)":C.border),borderRadius:18,overflow:"hidden"}}>
                      {/* Top strip */}
                      {isActive&&<div style={{height:3,background:"linear-gradient(90deg,#4ADE80,#22C55E)"}}/>}

                      <div style={{padding:"14px 16px"}}>
                        {/* Name + status */}
                        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:10}}>
                          <div style={{flex:1}}>
                            <div style={{fontWeight:800,fontSize:16,color:C.text,lineHeight:1.3}}>{tour.name}</div>
                            <div style={{fontSize:11,color:C.dim,marginTop:2}}>📅 {tour.date}</div>
                          </div>
                          <span style={{fontSize:10,padding:"4px 10px",borderRadius:20,fontWeight:700,flexShrink:0,
                            background:isActive?"rgba(74,222,128,0.12)":"rgba(107,114,128,0.15)",
                            color:isActive?"#4ADE80":"#6B7280",border:"1px solid "+(isActive?"rgba(74,222,128,0.25)":"rgba(107,114,128,0.2)")}}>
                            {isActive?"● Đang diễn ra":"✓ Kết thúc"}
                          </span>
                        </div>

                        {/* Stats row */}
                        <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
                          {[
                            {icon:"🎮",val:tour.format==="single"?"Đơn":tour.format==="double"?"Đôi":"Đội"},
                            {icon:"🔄",val:tour.rounds+" vòng"},
                            {icon:"⚔️",val:matchCount+" trận"},
                            {icon:"✔",val:confirmed+" xác nhận",color:"#4ADE80"},
                          ].map(({icon,val,color},i)=>(
                            <span key={i} style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:"rgba(255,255,255,0.05)",color:color||C.muted,border:"1px solid rgba(255,255,255,0.07)",fontWeight:600}}>
                              {icon} {val}
                            </span>
                          ))}
                          {tour.pin&&isAdmin&&(
                            <span style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:"rgba(96,165,250,0.1)",color:"#60A5FA",border:"1px solid rgba(96,165,250,0.2)",fontWeight:700}}>
                              🔑 PIN: {tour.pin}
                            </span>
                          )}
                        </div>

                        {tour.note&&<div style={{fontSize:11,color:C.dim,marginBottom:10,fontStyle:"italic"}}>📝 {tour.note}</div>}

                        {/* Action buttons */}
                        <div style={{display:"flex",gap:8}}>
                          <button onClick={()=>setViewTour(tour)}
                            style={{flex:1,padding:"10px 0",borderRadius:12,border:"1px solid rgba(96,165,250,0.3)",background:"rgba(96,165,250,0.08)",color:"#60A5FA",fontWeight:700,cursor:"pointer",fontSize:13}}>
                            👁 Xem chi tiết
                          </button>
                          {can("canManageTournament")&&isActive&&(
                            <button onClick={()=>{setActiveTour(tour);setShowMatchModal(true);}}
                              style={{flex:1,padding:"10px 0",borderRadius:12,border:"none",background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13,boxShadow:"0 3px 10px rgba(255,107,53,0.3)"}}>
                              + Thêm trận
                            </button>
                          )}
                        </div>

                        {/* End/Delete row */}
                        {(can("canManageTournament")&&isActive||can("canDeletePlayers"))&&(
                          <div style={{display:"flex",gap:8,marginTop:8}}>
                            {can("canManageTournament")&&isActive&&(
                              <button onClick={()=>handleEndTour(tour)}
                                style={{flex:1,padding:"9px 0",borderRadius:12,border:"1px solid rgba(74,222,128,0.25)",background:"rgba(74,222,128,0.06)",color:"#4ADE80",fontWeight:700,cursor:"pointer",fontSize:12}}>
                                🏁 Kết thúc giải
                              </button>
                            )}
                            {can("canDeletePlayers")&&(
                              <button onClick={()=>handleDeleteTour(tour)}
                                style={{padding:"9px 14px",borderRadius:12,border:"1px solid rgba(239,68,68,0.25)",background:"rgba(239,68,68,0.06)",color:"#F87171",fontWeight:700,cursor:"pointer",fontSize:13}}>
                                🗑
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ════ TOUR REGISTRATION SECTION ════ */}
        {tab==="tournament"&&(
          <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:4}}>

            {/* ── Public Registration Form ── */}
            <div style={{background:"rgba(255,255,255,0.028)",border:"1px solid "+C.border,borderRadius:18,overflow:"hidden"}}>
              <div style={{padding:"14px 16px 0"}}>
                <div style={{fontSize:14,fontWeight:800,color:C.orange,marginBottom:2}}>📋 Đăng ký tham gia giải</div>
                <div style={{fontSize:11,color:C.dim,marginBottom:12}}>Điền thông tin để đăng ký — Ban tổ chức sẽ duyệt đơn</div>
              </div>
              {tournaments.filter(t=>t.status==="active").length===0?(
                <div style={{textAlign:"center",color:C.dim,padding:"20px 16px 20px",fontSize:13}}>Hiện chưa có giải đấu nào đang mở đăng ký</div>
              ):!tourRegSubmitted?(
                <div style={{padding:"0 16px 16px",display:"flex",flexDirection:"column",gap:10}}>
                  {/* Chọn giải */}
                  <div>
                    <label style={{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:0.5,display:"block",marginBottom:5,textTransform:"uppercase"}}>Chọn giải đấu *</label>
                    <select value={tourRegForm.tourId} onChange={e=>setTourRegForm(f=>({...f,tourId:e.target.value}))} style={MS}>
                      <option value="">-- Chọn giải --</option>
                      {tournaments.filter(t=>t.status==="active").map(t=>(
                        <option key={t.id} value={t.id}>{t.name} ({t.date})</option>
                      ))}
                    </select>
                  </div>
                  {/* Tên VĐV */}
                  <div>
                    <label style={{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:0.5,display:"block",marginBottom:5,textTransform:"uppercase"}}>Tên vận động viên *</label>
                    <select value={tourRegForm.playerName} onChange={e=>setTourRegForm(f=>({...f,playerName:e.target.value}))} style={MS}>
                      <option value="">-- Chọn VĐV --</option>
                      {[...players.male,...players.female].sort((a,b)=>a.name.localeCompare(b.name,"vi")).map(p=>(
                        <option key={p.id} value={p.name}>{p.gender==="male"?"♂":"♀"} {p.name} | Tier {p.tier}</option>
                      ))}
                    </select>
                  </div>
                  {/* Nội dung */}
                  <div>
                    <label style={{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:0.5,display:"block",marginBottom:6,textTransform:"uppercase"}}>Nội dung tham dự *</label>
                    <div style={{display:"flex",gap:6}}>
                      {[["single","🎯 Đơn"],["double","👫 Đôi"],["mixed","🔀 Hỗn hợp"]].map(([v,l])=>(
                        <button key={v} onClick={()=>setTourRegForm(f=>({...f,content:v}))}
                          style={{flex:1,padding:"10px 4px",borderRadius:10,border:"1px solid",
                            borderColor:tourRegForm.content===v?C.orange:"rgba(255,255,255,0.1)",
                            background:tourRegForm.content===v?"rgba(255,107,53,0.15)":"rgba(255,255,255,0.04)",
                            color:tourRegForm.content===v?C.orange:C.muted,fontWeight:700,cursor:"pointer",fontSize:11}}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Đối tác (nếu đôi) */}
                  {(tourRegForm.content==="double"||tourRegForm.content==="mixed")&&(
                    <div>
                      <label style={{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:0.5,display:"block",marginBottom:5,textTransform:"uppercase"}}>Tên đối tác (đôi)</label>
                      <input value={tourRegForm.partner} onChange={e=>setTourRegForm(f=>({...f,partner:e.target.value}))} style={MS} placeholder="Tên VĐV đối tác..."/>
                    </div>
                  )}
                  {/* Liên hệ */}
                  <div>
                    <label style={{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:0.5,display:"block",marginBottom:5,textTransform:"uppercase"}}>Số điện thoại / Zalo</label>
                    <input value={tourRegForm.contact} onChange={e=>setTourRegForm(f=>({...f,contact:e.target.value}))} style={MS} placeholder="0901 234 567"/>
                  </div>
                  {/* Ghi chú */}
                  <div>
                    <label style={{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:0.5,display:"block",marginBottom:5,textTransform:"uppercase"}}>Ghi chú (tuỳ chọn)</label>
                    <input value={tourRegForm.note} onChange={e=>setTourRegForm(f=>({...f,note:e.target.value}))} style={MS} placeholder="Thông tin thêm..."/>
                  </div>
                  {/* Submit */}
                  {(()=>{
                    const ok=tourRegForm.tourId&&tourRegForm.playerName;
                    return(
                      <button onClick={handleTourRegister} disabled={!ok}
                        style={{padding:"14px",borderRadius:12,border:"none",marginTop:4,
                          background:ok?"linear-gradient(90deg,#FF6B35,#FF8C5A)":"rgba(255,255,255,0.06)",
                          color:ok?"#fff":"#4B5563",fontWeight:800,fontSize:14,cursor:ok?"pointer":"default",
                          boxShadow:ok?"0 4px 14px rgba(255,107,53,0.35)":"none"}}>
                        📋 Gửi đơn đăng ký
                      </button>
                    );
                  })()}
                </div>
              ):(
                <div style={{textAlign:"center",padding:"24px 16px 20px"}}>
                  <div style={{fontSize:40,marginBottom:10}}>✅</div>
                  <div style={{fontSize:15,fontWeight:700,color:"#4ADE80",marginBottom:6}}>Đã gửi đơn thành công!</div>
                  <div style={{fontSize:12,color:C.dim,marginBottom:16}}>Ban tổ chức sẽ xem xét và thông báo kết quả</div>
                  <button onClick={()=>{setTourRegSubmitted(false);setTourRegForm({tourId:"",playerName:"",contact:"",content:"single",partner:"",note:""});}}
                    style={{padding:"10px 24px",borderRadius:10,border:"1px solid rgba(255,107,53,0.3)",background:"rgba(255,107,53,0.08)",color:C.orange,fontWeight:700,cursor:"pointer",fontSize:13}}>
                    Đăng ký thêm
                  </button>
                </div>
              )}
            </div>

            {/* ── Admin/Mod: Registration Management ── */}
            {can("canManageTournament")&&(
              <div style={{background:"rgba(255,255,255,0.028)",border:"1px solid rgba(96,165,250,0.2)",borderRadius:18,overflow:"hidden"}}>
                <div style={{padding:"14px 16px 0",marginBottom:10}}>
                  <div style={{fontSize:14,fontWeight:800,color:"#60A5FA"}}>👥 Quản lý đơn đăng ký</div>
                  <div style={{fontSize:11,color:C.dim,marginTop:2}}>Duyệt hoặc từ chối đơn đăng ký của VĐV</div>
                </div>
                {tournaments.length===0?(
                  <div style={{textAlign:"center",color:C.dim,padding:"16px",fontSize:12}}>Chưa có giải đấu nào</div>
                ):(
                  <div style={{padding:"0 16px 16px",display:"flex",flexDirection:"column",gap:12}}>
                    {tournaments.map(tour=>{
                      const regs=tour.tourRegs||[];
                      const pending=regs.filter(r=>r.status==="pending");
                      const approved=regs.filter(r=>r.status==="approved");
                      const rejected=regs.filter(r=>r.status==="rejected");
                      return(
                        <div key={tour.id} style={{borderRadius:12,border:"1px solid rgba(255,255,255,0.07)",overflow:"hidden"}}>
                          {/* Tour header */}
                          <div style={{padding:"10px 12px",background:"rgba(255,255,255,0.03)",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}
                            onClick={()=>setShowTourRegAdmin(showTourRegAdmin?.id===tour.id?null:tour)}>
                            <div>
                              <div style={{fontSize:13,fontWeight:700,color:C.text}}>{tour.name}</div>
                              <div style={{fontSize:11,color:C.dim,marginTop:2,display:"flex",gap:8}}>
                                <span style={{color:"#FBBF24",fontWeight:600}}>{pending.length} chờ duyệt</span>
                                <span style={{color:"#4ADE80"}}>{approved.length} đã duyệt</span>
                                <span style={{color:"#F87171"}}>{rejected.length} từ chối</span>
                              </div>
                            </div>
                            <span style={{color:C.dim,fontSize:16}}>{showTourRegAdmin?.id===tour.id?"▲":"▼"}</span>
                          </div>
                          {/* Reg list */}
                          {showTourRegAdmin?.id===tour.id&&(
                            <div style={{padding:"8px 12px 12px",display:"flex",flexDirection:"column",gap:8}}>
                              {regs.length===0?(
                                <div style={{textAlign:"center",color:C.dim,padding:"12px 0",fontSize:12}}>Chưa có đơn đăng ký nào</div>
                              ):regs.map((reg,ri)=>(
                                <div key={reg.id||ri} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px 12px",
                                  border:"1px solid "+(reg.status==="approved"?"rgba(74,222,128,0.25)":reg.status==="rejected"?"rgba(248,113,113,0.25)":"rgba(251,191,36,0.2)")}}>
                                  {/* Status badge + name */}
                                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                                    <div style={{fontWeight:700,fontSize:13,color:C.text}}>{reg.playerName}</div>
                                    <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700,
                                      background:reg.status==="approved"?"rgba(74,222,128,0.12)":reg.status==="rejected"?"rgba(248,113,113,0.12)":"rgba(251,191,36,0.12)",
                                      color:reg.status==="approved"?"#4ADE80":reg.status==="rejected"?"#F87171":"#FBBF24"}}>
                                      {reg.status==="approved"?"✓ Đã duyệt":reg.status==="rejected"?"✗ Từ chối":"⏳ Chờ duyệt"}
                                    </span>
                                  </div>
                                  {/* Details */}
                                  <div style={{fontSize:11,color:C.dim,display:"flex",flexWrap:"wrap",gap:"2px 12px",marginBottom:reg.status==="pending"?8:0}}>
                                    <span>🎯 {reg.content==="single"?"Đơn":reg.content==="double"?"Đôi":"Hỗn hợp"}</span>
                                    {reg.partner&&<span>👫 {reg.partner}</span>}
                                    {reg.contact&&<span>📞 {reg.contact}</span>}
                                    {reg.note&&<span>📝 {reg.note}</span>}
                                    <span style={{color:C.dim}}>🕐 {reg.time}</span>
                                  </div>
                                  {/* Action buttons - only for pending */}
                                  {reg.status==="pending"&&(
                                    <div style={{display:"flex",gap:8,marginTop:8}}>
                                      <button onClick={()=>handleTourRegApprove(tour,reg.id)}
                                        style={{flex:1,padding:"9px 0",borderRadius:10,border:"none",background:"rgba(74,222,128,0.15)",color:"#4ADE80",fontWeight:700,cursor:"pointer",fontSize:12}}>
                                        ✓ Duyệt
                                      </button>
                                      <button onClick={()=>handleTourRegReject(tour,reg.id)}
                                        style={{flex:1,padding:"9px 0",borderRadius:10,border:"none",background:"rgba(248,113,113,0.12)",color:"#F87171",fontWeight:700,cursor:"pointer",fontSize:12}}>
                                        ✗ Từ chối
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════ CREATE TOURNAMENT MODAL ════ */}
        {showTourModal&&can("canCreateTournament")&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:400,backdropFilter:"blur(6px)"}} onClick={()=>setShowTourModal(false)}>
            <div style={{background:"linear-gradient(145deg,#181818,#222)",border:"1px solid rgba(255,107,53,0.3)",borderRadius:"20px 20px 0 0",padding:"24px 20px 36px",width:"100%",maxWidth:520,boxShadow:"0 -16px 40px rgba(0,0,0,0.7)"}} onClick={e=>e.stopPropagation()}>
              <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 20px"}}/>
              <div style={{fontSize:16,fontWeight:800,color:C.orange,marginBottom:18}}>🏅 Tạo giải đấu mới</div>
              {[
                {label:"Tên giải *",node:<input value={tourForm.name} onChange={e=>setTourForm(f=>({...f,name:e.target.value}))} style={MS} placeholder="VD: WeekBoom 5 – 10/03/2026"/>},
                {label:"Ngày thi đấu *",node:<input value={tourForm.date} onChange={e=>setTourForm(f=>({...f,date:e.target.value}))} style={MS} type="date"/>},
                {label:"Thể thức",node:(
                  <div style={{display:"flex",gap:8}}>
                    {[["single","🎯 Đơn"],["double","👫 Đôi"],["team","👥 Đội"]].map(([v,l])=>(
                      <button key={v} onClick={()=>setTourForm(f=>({...f,format:v}))} style={{flex:1,padding:"10px 6px",borderRadius:10,border:"1px solid",borderColor:tourForm.format===v?C.orange:"rgba(255,255,255,0.1)",background:tourForm.format===v?"rgba(255,107,53,0.15)":"rgba(255,255,255,0.04)",color:tourForm.format===v?C.orange:C.muted,fontWeight:700,cursor:"pointer",fontSize:12}}>{l}</button>
                    ))}
                  </div>
                )},
                {label:"Số vòng đấu",node:<input value={tourForm.rounds} onChange={e=>setTourForm(f=>({...f,rounds:e.target.value}))} style={MS} type="number" min="1" placeholder="1"/>},
                {label:"Best of (số game/trận)",node:(
                  <div style={{display:"flex",gap:6}}>
                    {[["1","Bo1"],["3","Bo3"],["5","Bo5"]].map(([v,l])=>(
                      <button key={v} onClick={()=>setTourForm(f=>({...f,bestOf:v}))} style={{flex:1,padding:"10px",borderRadius:10,border:"1px solid",borderColor:tourForm.bestOf===v?C.orange:"rgba(255,255,255,0.1)",background:tourForm.bestOf===v?"rgba(255,107,53,0.15)":"rgba(255,255,255,0.04)",color:tourForm.bestOf===v?C.orange:C.muted,fontWeight:700,cursor:"pointer",fontSize:13}}>{l}</button>
                    ))}
                  </div>
                )},
                {label:"Mã PIN trọng tài (để trống = tự động tạo)",node:<input value={tourForm.pin} onChange={e=>setTourForm(f=>({...f,pin:e.target.value.split("").filter(c=>c>="0"&&c<="9").join("").slice(0,6)}))} style={MS} placeholder="VD: 1234 (tự động nếu để trống)" maxLength={6}/>},
                {label:"Ghi chú (tuỳ chọn)",node:<input value={tourForm.note} onChange={e=>setTourForm(f=>({...f,note:e.target.value}))} style={MS} placeholder="Địa điểm, thông tin thêm..."/>},
              ].map(({label,node},i)=>(
                <div key={i} style={{marginBottom:12}}>
                  <label style={{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:0.5,display:"block",marginBottom:5,textTransform:"uppercase"}}>{label}</label>
                  {node}
                </div>
              ))}
              <div style={{display:"flex",gap:10,marginTop:18}}>
                <button onClick={()=>setShowTourModal(false)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:12,padding:"12px",cursor:"pointer",fontSize:14,fontWeight:600}}>Hủy</button>
                <button onClick={handleCreateTour} disabled={!tourForm.name.trim()||!tourForm.date} style={{flex:2,background:(!tourForm.name.trim()||!tourForm.date)?"rgba(255,255,255,0.08)":"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:(!tourForm.name.trim()||!tourForm.date)?"#666":"#fff",borderRadius:12,padding:"12px",cursor:"pointer",fontSize:14,fontWeight:800}}>🏅 Tạo giải</button>
              </div>
            </div>
          </div>
        )}

        {/* ════ ADD MATCH MODAL ════ */}
        {showMatchModal&&activeTour&&can("canManageTournament")&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",display:"flex",flexDirection:"column",zIndex:400,backdropFilter:"blur(6px)"}}>
            {/* Header */}
            <div style={{background:"linear-gradient(145deg,#181818,#222)",borderBottom:"1px solid rgba(96,165,250,0.2)",padding:"14px 16px",flexShrink:0,display:"flex",alignItems:"center",gap:12}}>
              <button onClick={()=>setShowMatchModal(false)} style={{background:"rgba(255,255,255,0.08)",border:"none",color:C.muted,borderRadius:10,padding:"8px 12px",cursor:"pointer",fontSize:13,fontWeight:700}}>← Hủy</button>
              <div>
                <div style={{fontSize:15,fontWeight:800,color:"#60A5FA"}}>⚔️ Thêm kết quả trận</div>
                <div style={{fontSize:11,color:C.dim}}>{activeTour.name}</div>
              </div>
            </div>

            {/* Body */}
            <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:14}}>

              {/* Round */}
              <div style={{display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.03)",borderRadius:12,padding:"12px 14px",border:"1px solid rgba(255,255,255,0.07)"}}>
                <span style={{fontSize:13,color:C.muted,fontWeight:600}}>Vòng đấu:</span>
                <input value={matchForm.round} onChange={e=>setMatchForm(f=>({...f,round:e.target.value}))}
                  style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(96,165,250,0.25)",borderRadius:8,padding:"8px 12px",color:C.text,fontSize:15,fontWeight:700,outline:"none",width:60}}
                  type="number" min="1"/>
              </div>

              {/* Score input - big and touch-friendly */}
              <div style={{background:"rgba(255,107,53,0.05)",borderRadius:16,padding:"16px",border:"1px solid rgba(255,107,53,0.15)"}}>
                <div style={{fontSize:11,color:C.orange,fontWeight:800,marginBottom:12,textAlign:"center",letterSpacing:1}}>TỈ SỐ TRẬN</div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{flex:1,textAlign:"center"}}>
                    <div style={{fontSize:10,color:C.orange,fontWeight:700,marginBottom:6}}>🔴 ĐỘI 1</div>
                    <input value={matchForm.score1} onChange={e=>setMatchForm(f=>({...f,score1:e.target.value}))}
                      style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"2px solid rgba(255,107,53,0.4)",borderRadius:14,padding:"16px 8px",color:"#FF6B35",fontSize:36,fontWeight:900,textAlign:"center",outline:"none",boxSizing:"border-box"}}
                      type="number" min="0" inputMode="numeric"/>
                  </div>
                  <div style={{fontSize:22,fontWeight:900,color:C.muted,flexShrink:0}}>–</div>
                  <div style={{flex:1,textAlign:"center"}}>
                    <div style={{fontSize:10,color:"#60A5FA",fontWeight:700,marginBottom:6}}>🔵 ĐỘI 2</div>
                    <input value={matchForm.score2} onChange={e=>setMatchForm(f=>({...f,score2:e.target.value}))}
                      style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"2px solid rgba(96,165,250,0.4)",borderRadius:14,padding:"16px 8px",color:"#60A5FA",fontSize:36,fontWeight:900,textAlign:"center",outline:"none",boxSizing:"border-box"}}
                      type="number" min="0" inputMode="numeric"/>
                  </div>
                </div>
              </div>

              {/* Team 1 */}
              <div style={{background:"rgba(255,107,53,0.04)",borderRadius:14,padding:"14px",border:"1px solid rgba(255,107,53,0.12)"}}>
                <div style={{fontSize:12,color:C.orange,fontWeight:800,marginBottom:10}}>🔴 ĐỘI 1</div>
                <select value={matchForm.p1} onChange={e=>setMatchForm(f=>({...f,p1:e.target.value}))} style={{...MS,marginBottom:10}}>
                  <option value="">-- Chọn VĐV --</option>
                  {[...players.male,...players.female].sort((a,b)=>a.name.localeCompare(b.name,"vi")).map(p=>(
                    <option key={p.id} value={p.name}>{p.gender==="male"?"♂":"♀"} {p.name} | {p.tier}</option>
                  ))}
                </select>
                {activeTour.format==="double"&&(
                  <select value={matchForm.p2} onChange={e=>setMatchForm(f=>({...f,p2:e.target.value}))} style={MS}>
                    <option value="">-- VĐV 2 (đôi) --</option>
                    {[...players.male,...players.female].sort((a,b)=>a.name.localeCompare(b.name,"vi")).map(p=>(
                      <option key={p.id} value={p.name}>{p.gender==="male"?"♂":"♀"} {p.name} | {p.tier}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Team 2 */}
              <div style={{background:"rgba(96,165,250,0.04)",borderRadius:14,padding:"14px",border:"1px solid rgba(96,165,250,0.12)"}}>
                <div style={{fontSize:12,color:"#60A5FA",fontWeight:800,marginBottom:10}}>🔵 ĐỘI 2</div>
                <select value={matchForm.p3} onChange={e=>setMatchForm(f=>({...f,p3:e.target.value}))} style={{...MS,marginBottom:10}}>
                  <option value="">-- Chọn VĐV --</option>
                  {[...players.male,...players.female].sort((a,b)=>a.name.localeCompare(b.name,"vi")).map(p=>(
                    <option key={p.id} value={p.name}>{p.gender==="male"?"♂":"♀"} {p.name} | {p.tier}</option>
                  ))}
                </select>
                {activeTour.format==="double"&&(
                  <select value={matchForm.p4} onChange={e=>setMatchForm(f=>({...f,p4:e.target.value}))} style={MS}>
                    <option value="">-- VĐV 2 (đôi) --</option>
                    {[...players.male,...players.female].sort((a,b)=>a.name.localeCompare(b.name,"vi")).map(p=>(
                      <option key={p.id} value={p.name}>{p.gender==="male"?"♂":"♀"} {p.name} | {p.tier}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Save button */}
              {(()=>{
                const ok=matchForm.p1&&matchForm.p3&&(matchForm.score1!==""||matchForm.score2!=="");
                return(
                  <button onClick={handleAddMatch} disabled={!ok}
                    style={{padding:"16px",borderRadius:14,border:"none",
                      background:ok?"linear-gradient(90deg,#60A5FA,#3B82F6)":"rgba(255,255,255,0.06)",
                      color:ok?"#fff":"#4B5563",fontWeight:800,fontSize:16,cursor:ok?"pointer":"default",
                      boxShadow:ok?"0 4px 16px rgba(96,165,250,0.35)":"none"}}>
                    ✔ Lưu kết quả trận
                  </button>
                );
              })()}
            </div>
          </div>
        )}

        {/* ════ VIEW TOURNAMENT DETAIL MODAL ════ */}
        {viewTour&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",display:"flex",flexDirection:"column",zIndex:400,backdropFilter:"blur(8px)"}}>
            {/* Fixed header */}
            <div style={{background:"linear-gradient(145deg,#181818,#222)",borderBottom:"1px solid rgba(255,180,71,0.2)",padding:"14px 16px",flexShrink:0}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <button onClick={()=>setViewTour(null)} style={{background:"rgba(255,255,255,0.08)",border:"none",color:C.muted,borderRadius:10,padding:"8px 12px",cursor:"pointer",fontSize:13,fontWeight:700,flexShrink:0}}>
                  ← Back
                </button>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:16,fontWeight:800,color:"#FFB347",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{viewTour.name}</div>
                  <div style={{fontSize:11,color:C.dim,display:"flex",gap:8,flexWrap:"wrap",marginTop:2}}>
                    <span>📅 {viewTour.date}</span>
                    <span>🎮 {viewTour.format==="single"?"Đơn":viewTour.format==="double"?"Đôi":"Đội"}</span>
                    <span style={{color:viewTour.status==="active"?"#4ADE80":"#6B7280"}}>{viewTour.status==="active"?"● Đang diễn ra":"✓ Kết thúc"}</span>
                  </div>
                </div>
              </div>
              {can("canManageTournament")&&viewTour.status==="active"&&(
                <button onClick={()=>{setActiveTour(viewTour);setViewTour(null);setShowMatchModal(true);}}
                  style={{width:"100%",marginTop:10,padding:"11px",borderRadius:12,border:"none",background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",boxShadow:"0 3px 10px rgba(255,107,53,0.3)"}}>
                  ⚔️ + Thêm kết quả trận
                </button>
              )}
            </div>

            {/* Scrollable body */}
            <div style={{flex:1,overflowY:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:14}}>

              {/* Leaderboard */}
              {(()=>{
                const scoreMap={};
                (viewTour.matches||[]).forEach(m=>{
                  [...(m.team1||[]),...(m.team2||[])].forEach(n=>{if(n&&!scoreMap[n])scoreMap[n]={name:n,wins:0,losses:0,games_w:0,games_l:0};});
                  (m.team1||[]).forEach(n=>{if(n){if(m.score1>m.score2){scoreMap[n].wins++;scoreMap[n].games_w+=m.score1;scoreMap[n].games_l+=m.score2;}else{scoreMap[n].losses++;scoreMap[n].games_w+=m.score1;scoreMap[n].games_l+=m.score2;}}});
                  (m.team2||[]).forEach(n=>{if(n){if(m.score2>m.score1){scoreMap[n].wins++;scoreMap[n].games_w+=m.score2;scoreMap[n].games_l+=m.score1;}else{scoreMap[n].losses++;scoreMap[n].games_w+=m.score2;scoreMap[n].games_l+=m.score1;}}});
                });
                const lb=Object.values(scoreMap).sort((a,b)=>b.wins-a.wins||(a.losses-b.losses));
                if(lb.length===0) return null;
                return(
                  <div>
                    <div style={{fontSize:12,fontWeight:800,color:"#FFB347",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>🏆 BẢNG XẾP HẠNG</div>
                    {lb.map((p,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 12px",borderRadius:12,marginBottom:6,
                        background:i===0?"rgba(255,215,0,0.06)":i===1?"rgba(192,192,192,0.05)":i===2?"rgba(205,127,50,0.05)":"rgba(255,255,255,0.03)",
                        border:"1px solid "+(i===0?"rgba(255,215,0,0.15)":i===1?"rgba(192,192,192,0.1)":i===2?"rgba(205,127,50,0.1)":"rgba(255,255,255,0.06)")}}>
                        <span style={{fontSize:18,width:28,textAlign:"center",flexShrink:0}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":<span style={{fontSize:13,color:C.dim,fontWeight:700}}>{i+1}</span>}</span>
                        <span style={{flex:1,fontWeight:700,fontSize:14,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</span>
                        <div style={{display:"flex",gap:6,flexShrink:0}}>
                          <span style={{fontSize:12,padding:"3px 8px",borderRadius:8,background:"rgba(74,222,128,0.12)",color:"#4ADE80",fontWeight:700}}>{p.wins}W</span>
                          <span style={{fontSize:12,padding:"3px 8px",borderRadius:8,background:"rgba(248,113,113,0.12)",color:"#F87171",fontWeight:700}}>{p.losses}L</span>
                          <span style={{fontSize:11,padding:"3px 8px",borderRadius:8,background:"rgba(255,255,255,0.06)",color:C.muted,fontWeight:600}}>{p.wins+p.losses>0?Math.round(p.wins/(p.wins+p.losses)*100):0}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Match results */}
              <div>
                <div style={{fontSize:12,fontWeight:800,color:C.muted,marginBottom:10}}>⚔️ KẾT QUẢ TRẬN ({(viewTour.matches||[]).length})</div>
                {(viewTour.matches||[]).length===0?(
                  <div style={{textAlign:"center",color:C.dim,padding:"24px 0",fontSize:13,background:"rgba(255,255,255,0.02)",borderRadius:12,border:"1px solid "+C.border}}>Chưa có kết quả nào</div>
                ):(
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {[...(viewTour.matches||[])].reverse().map((m,i)=>{
                      const w1=m.score1>m.score2, w2=m.score2>m.score1;
                      return(
                        <div key={i} style={{background:"rgba(255,255,255,0.03)",borderRadius:14,overflow:"hidden",border:"1px solid "+(m.confirmed?"rgba(74,222,128,0.15)":"rgba(255,255,255,0.07)")}}>
                          {/* Match header */}
                          <div style={{padding:"7px 12px",background:"rgba(255,255,255,0.02)",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                            <span style={{fontSize:10,color:C.dim}}>Vòng {m.round} · {m.time}</span>
                            {m.confirmed&&<span style={{fontSize:9,color:"#4ADE80",fontWeight:700,padding:"2px 6px",borderRadius:6,background:"rgba(74,222,128,0.1)"}}>✔ Đã xác nhận</span>}
                          </div>
                          {/* Score */}
                          <div style={{padding:"12px",display:"flex",alignItems:"center",gap:8}}>
                            <div style={{flex:1,textAlign:"right"}}>
                              <div style={{fontSize:13,fontWeight:w1?800:500,color:w1?"#4ADE80":C.muted,lineHeight:1.3}}>{(m.team1||[]).join(" & ")||"?"}</div>
                            </div>
                            <div style={{background:w1||w2?"rgba(255,107,53,0.15)":"rgba(255,255,255,0.06)",borderRadius:10,padding:"8px 14px",textAlign:"center",flexShrink:0,minWidth:70}}>
                              <div style={{fontSize:20,fontWeight:900,color:C.orange,lineHeight:1}}>{m.score1} – {m.score2}</div>
                              {m.games&&m.games.length>0&&(
                                <div style={{fontSize:9,color:C.dim,marginTop:3}}>{m.games.map((g,gi)=>g.t1+"-"+g.t2).join(" | ")}</div>
                              )}
                            </div>
                            <div style={{flex:1}}>
                              <div style={{fontSize:13,fontWeight:w2?800:500,color:w2?"#4ADE80":C.muted,lineHeight:1.3}}>{(m.team2||[]).join(" & ")||"?"}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
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
      <nav style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(13,13,13,0.97)",borderTop:"1px solid "+C.border,display:"flex",zIndex:100,paddingBottom:0,boxShadow:"0 -4px 24px rgba(0,0,0,0.5)"}}>
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
      {showAddModal&&can("canAddPlayers")&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:400,backdropFilter:"blur(6px)"}} onClick={()=>setShowAddModal(false)}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",border:"1px solid rgba(255,107,53,0.35)",borderRadius:"20px 20px 0 0",padding:"24px 20px 36px",width:"100%",maxWidth:520,boxShadow:"0 -16px 40px rgba(0,0,0,0.7)"}} onClick={e=>e.stopPropagation()}>
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
              <button onClick={handleAddPlayer} style={{flex:2,background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:12,padding:"12px",cursor:"pointer",fontSize:14,fontWeight:800,boxShadow:"0 4px 14px rgba(255,107,53,0.4)"}}>Thêm VĐV</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADJUST MODAL ── */}
      {adjModal&&can("canAdjustScore")&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:400,backdropFilter:"blur(6px)"}} onClick={()=>setAdjModal(null)}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",border:"1px solid rgba(255,107,53,0.35)",borderRadius:"20px 20px 0 0",padding:"24px 20px 36px",width:"100%",maxWidth:520,boxShadow:"0 -16px 40px rgba(0,0,0,0.7)"}} onClick={e=>e.stopPropagation()}>
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
              <button onClick={handleAdjust} style={{flex:2,background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:12,padding:"12px",cursor:"pointer",fontSize:14,fontWeight:800,boxShadow:"0 4px 14px rgba(255,107,53,0.4)"}}>Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      {/* ── LOGIN MODAL ── */}
      {auth.showLogin&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:400,backdropFilter:"blur(6px)"}} onClick={()=>setAuth(a=>({...a,showLogin:false,err:""}))}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",border:"1px solid rgba(255,107,53,0.35)",borderRadius:"20px 20px 0 0",padding:"24px 20px 36px",width:"100%",maxWidth:520,boxShadow:"0 -16px 40px rgba(0,0,0,0.7)"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 20px"}}/>
            <div style={{textAlign:"center",marginBottom:22}}>
              <div style={{fontSize:36,marginBottom:8}}>🔐</div>
              <div style={{fontSize:17,fontWeight:900,color:C.orange}}>🔑 Đăng nhập hệ thống</div>
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
              <button onClick={handleLogin} style={{flex:2,background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:12,padding:"12px",cursor:"pointer",fontSize:14,fontWeight:800,boxShadow:"0 4px 14px rgba(255,107,53,0.4)"}}>🔑 Đăng nhập</button>
            </div>
            <div style={{marginTop:14,fontSize:11,color:C.dim,textAlign:"center"}}>Liên hệ quản trị viên CLB để được cấp tài khoản</div>
          </div>
        </div>
      )}

      {/* ── EDIT PLAYER MODAL ── */}
      {editModal&&can("canEditPlayers")&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:400,backdropFilter:"blur(6px)"}} onClick={()=>setEditModal(null)}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",border:"1px solid rgba(96,165,250,0.35)",borderRadius:"20px 20px 0 0",padding:"24px 20px 36px",width:"100%",maxWidth:520,boxShadow:"0 -16px 40px rgba(0,0,0,0.7)"}} onClick={e=>e.stopPropagation()}>
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
      {/* ══════════════ REFEREE FULLSCREEN MODE ══════════════ */}
      {refMode&&(
        <div style={{position:"fixed",inset:0,background:"#0a0a0a",zIndex:500,display:"flex",flexDirection:"column",overflowY:"auto"}}>

          {/* Header */}
          <div style={{background:"rgba(96,165,250,0.12)",borderBottom:"1px solid rgba(96,165,250,0.25)",padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:22}}>🏳️</span>
              <div>
                <div style={{fontWeight:800,fontSize:15,color:"#60A5FA"}}>Chế độ Trọng tài</div>
                {refTour&&<div style={{fontSize:11,color:"#93C5FD"}}>{refTour.name} · {refTour.date}</div>}
              </div>
            </div>
            <button onClick={()=>{setRefMode(false);setRefTour(null);setRefMatch(null);setRefGames([]);}} style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.3)",color:"#F87171",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:13,fontWeight:700}}>
              ✕ Thoát
            </button>
          </div>

          <div style={{flex:1,padding:"16px",maxWidth:600,margin:"0 auto",width:"100%"}}>

            {/* ── PIN Entry ── */}
            {!refTour&&(
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",gap:20}}>
                <div style={{fontSize:48}}>🔑</div>
                <div style={{fontSize:20,fontWeight:800,color:"#60A5FA",textAlign:"center"}}>Nhập mã PIN giải đấu</div>
                <div style={{fontSize:13,color:"#6B7280",textAlign:"center"}}>Nhận mã PIN từ BTC trước khi bắt đầu</div>
                <div style={{width:"100%",maxWidth:320}}>
                  <input
                    value={refPinInput}
                    onChange={e=>setRefPinInput(e.target.value.split("").filter(c=>c>="0"&&c<="9").join("").slice(0,6))}
                    onKeyDown={e=>e.key==="Enter"&&handleRefPinSubmit()}
                    style={{...MS,fontSize:28,textAlign:"center",letterSpacing:8,fontWeight:800,color:"#60A5FA",borderColor:"rgba(96,165,250,0.4)"}}
                    placeholder="····"
                    maxLength={6}
                  />
                  {refPinErr&&<div style={{color:"#F87171",fontSize:12,marginTop:6,textAlign:"center"}}>{refPinErr}</div>}
                  <button onClick={handleRefPinSubmit} style={{width:"100%",marginTop:12,padding:"14px",borderRadius:12,border:"none",background:"linear-gradient(90deg,#60A5FA,#3B82F6)",color:"#fff",fontWeight:800,fontSize:16,cursor:"pointer",boxShadow:"0 4px 16px rgba(96,165,250,0.35)"}}>
                    ✔ Xác nhận PIN
                  </button>
                </div>
              </div>
            )}

            {/* ── Player picker (when new match has no teams) ── */}
            {refTour&&refMatch&&!refConfirmed&&(!refMatch.team1?.length||!refMatch.team2?.length)&&(()=>{
              const isDouble=refTour.format==="double";
              const allP=[...players.male,...players.female].sort((a,b)=>a.name.localeCompare(b.name,"vi"));
              const t1=refMatch.team1||[], t2=refMatch.team2||[];
              const maxT = isDouble?2:1;
              const canStart = t1.length===maxT && t2.length===maxT;
              return(
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div style={{fontSize:15,fontWeight:800,color:"#60A5FA"}}>Chọn VĐV thi đấu</div>
                  <div style={{display:"flex",gap:10}}>
                    {[[t1,"🔵 Đội 1"],[t2,"🔴 Đội 2"]].map(([team,label],ti)=>(
                      <div key={ti} style={{flex:1,background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"10px",border:"1px solid rgba(255,255,255,0.08)"}}>
                        <div style={{fontSize:11,fontWeight:700,color:ti===0?"#60A5FA":"#F87171",marginBottom:8}}>{label} ({team.length}/{maxT})</div>
                        {team.map(n=>(
                          <div key={n} style={{fontSize:12,fontWeight:700,color:"#E5E7EB",background:"rgba(255,255,255,0.06)",borderRadius:8,padding:"6px 8px",marginBottom:4,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            {n}
                            <button onClick={()=>{
                              const newTeam=team.filter(x=>x!==n);
                              setRefMatch(m=>({...m,[ti===0?"team1":"team2"]:newTeam}));
                            }} style={{background:"none",border:"none",color:"#F87171",cursor:"pointer",fontSize:14}}>✕</button>
                          </div>
                        ))}
                        {team.length<maxT&&<div style={{fontSize:11,color:"#4B5563",textAlign:"center",padding:"4px"}}>Chọn từ danh sách ↓</div>}
                      </div>
                    ))}
                  </div>
                  <div style={{maxHeight:320,overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>
                    {allP.filter(p=>!t1.includes(p.name)&&!t2.includes(p.name)).map(p=>{
                      const t1Full=t1.length>=maxT, t2Full=t2.length>=maxT;
                      return(
                        <div key={p.id} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,border:"1px solid rgba(255,255,255,0.06)"}}>
                          <div>
                            <span style={{fontWeight:700,fontSize:13,color:"#E5E7EB"}}>{p.name}</span>
                            <span style={{fontSize:11,color:"#6B7280",marginLeft:8}}>{p.tier} · {p.boom.toFixed(2)}</span>
                          </div>
                          <div style={{display:"flex",gap:6}}>
                            <button disabled={t1Full} onClick={()=>setRefMatch(m=>({...m,team1:[...t1,p.name]}))}
                              style={{padding:"6px 12px",borderRadius:8,border:"none",
                                background:t1Full?"rgba(255,255,255,0.04)":"rgba(96,165,250,0.2)",
                                color:t1Full?"#4B5563":"#60A5FA",
                                fontWeight:700,cursor:t1Full?"default":"pointer",fontSize:12}}>🔵 Đội 1</button>
                            <button disabled={t2Full} onClick={()=>setRefMatch(m=>({...m,team2:[...t2,p.name]}))}
                              style={{padding:"6px 12px",borderRadius:8,border:"none",
                                background:t2Full?"rgba(255,255,255,0.04)":"rgba(248,113,113,0.2)",
                                color:t2Full?"#4B5563":"#F87171",
                                fontWeight:700,cursor:t2Full?"default":"pointer",fontSize:12}}>🔴 Đội 2</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <button onClick={handleRefExitMatch} style={{flex:1,padding:"13px",borderRadius:12,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"#6B7280",fontWeight:700,cursor:"pointer"}}>← Quay lại</button>
                    <button disabled={!canStart} onClick={()=>{
                      const numGames=refTour?.bestOf||3;
                      setRefGames(Array.from({length:numGames},()=>({t1:"",t2:""})));
                    }} style={{flex:2,padding:"13px",borderRadius:12,border:"none",
                      background:canStart?"linear-gradient(90deg,#60A5FA,#3B82F6)":"rgba(255,255,255,0.06)",
                      color:canStart?"#fff":"#4B5563",
                      fontWeight:800,cursor:canStart?"pointer":"default",fontSize:15}}>
                      ▶ Bắt đầu nhập điểm
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* ── Match scoring screen ── */}
            {refTour&&refMatch&&!refConfirmed&&refMatch.team1?.length>0&&refMatch.team2?.length>0&&refGames.length>0&&(()=>{
              const isDouble = refMatch.format==="double"||refTour.format==="double";
              const t1 = refMatch.team1?.join(" & ")||"Đội 1";
              const t2 = refMatch.team2?.join(" & ")||"Đội 2";
              const s1 = refGames.filter(g=>(parseInt(g.t1)||0)>(parseInt(g.t2)||0)).length;
              const s2 = refGames.filter(g=>(parseInt(g.t2)||0)>(parseInt(g.t1)||0)).length;
              return(
                <div style={{display:"flex",flexDirection:"column",gap:16}}>
                  {/* Match header */}
                  <div style={{background:"rgba(96,165,250,0.08)",border:"1px solid rgba(96,165,250,0.2)",borderRadius:16,padding:"16px",textAlign:"center"}}>
                    <div style={{fontSize:11,color:"#60A5FA",fontWeight:700,marginBottom:8,letterSpacing:1}}>VÒNG {refMatch.round} · {refTour.name}</div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12}}>
                      <div style={{flex:1,textAlign:"right"}}>
                        <div style={{fontSize:15,fontWeight:800,color:"#E5E7EB"}}>{t1}</div>
                      </div>
                      <div style={{background:"rgba(255,255,255,0.08)",borderRadius:10,padding:"8px 16px",minWidth:80,textAlign:"center"}}>
                        <div style={{fontSize:28,fontWeight:900,color:"#FBBF24"}}>{s1} – {s2}</div>
                        <div style={{fontSize:10,color:"#6B7280"}}>Tổng game</div>
                      </div>
                      <div style={{flex:1,textAlign:"left"}}>
                        <div style={{fontSize:15,fontWeight:800,color:"#E5E7EB"}}>{t2}</div>
                      </div>
                    </div>
                  </div>

                  {/* Game scores */}
                  <div style={{fontSize:13,fontWeight:700,color:"#6B7280",letterSpacing:0.5}}>NHẬP ĐIỂM TỪNG GAME</div>
                  {refGames.map((g,i)=>(
                    <div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"14px 16px"}}>
                      <div style={{fontSize:12,color:"#60A5FA",fontWeight:700,marginBottom:10}}>GAME {i+1}</div>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{flex:1}}>
                          <div style={{fontSize:10,color:"#6B7280",marginBottom:4,textAlign:"center"}}>{t1}</div>
                          <input
                            type="number" min="0" max="30"
                            value={g.t1}
                            onChange={e=>{const v=e.target.value;setRefGames(prev=>prev.map((x,j)=>j===i?{...x,t1:v}:x));}}
                            style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"2px solid rgba(96,165,250,0.35)",borderRadius:12,padding:"14px 10px",color:"#E5E7EB",fontSize:28,fontWeight:800,textAlign:"center",outline:"none",boxSizing:"border-box"}}
                          />
                        </div>
                        <div style={{fontSize:18,color:"#4B5563",fontWeight:800,flexShrink:0}}>–</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:10,color:"#6B7280",marginBottom:4,textAlign:"center"}}>{t2}</div>
                          <input
                            type="number" min="0" max="30"
                            value={g.t2}
                            onChange={e=>{const v=e.target.value;setRefGames(prev=>prev.map((x,j)=>j===i?{...x,t2:v}:x));}}
                            style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"2px solid rgba(96,165,250,0.35)",borderRadius:12,padding:"14px 10px",color:"#E5E7EB",fontSize:28,fontWeight:800,textAlign:"center",outline:"none",boxSizing:"border-box"}}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Action buttons */}
                  <div style={{display:"flex",gap:10,marginTop:4}}>
                    <button onClick={handleRefExitMatch} style={{flex:1,padding:"14px",borderRadius:12,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"#6B7280",fontWeight:700,cursor:"pointer",fontSize:14}}>
                      ← Quay lại
                    </button>
                    <button onClick={handleRefSaveMatch} style={{flex:2,padding:"14px",borderRadius:12,border:"none",background:"linear-gradient(90deg,#4ADE80,#22C55E)",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:15,boxShadow:"0 4px 16px rgba(74,222,128,0.3)"}}>
                      ✔ Xác nhận kết quả
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* ── Confirmed screen ── */}
            {refTour&&refMatch&&refConfirmed&&(()=>{
              const s1=refGames.filter(g=>(parseInt(g.t1)||0)>(parseInt(g.t2)||0)).length;
              const s2=refGames.filter(g=>(parseInt(g.t2)||0)>(parseInt(g.t1)||0)).length;
              const winner = s1>s2 ? refMatch.team1?.join(" & ") : refMatch.team2?.join(" & ");
              return(
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"50vh",gap:16,textAlign:"center"}}>
                  <div style={{fontSize:56}}>🎉</div>
                  <div style={{fontSize:20,fontWeight:800,color:"#4ADE80"}}>Đã xác nhận kết quả!</div>
                  <div style={{background:"rgba(74,222,128,0.08)",border:"1px solid rgba(74,222,128,0.2)",borderRadius:16,padding:"16px 24px",minWidth:260}}>
                    <div style={{fontSize:13,color:"#6B7280",marginBottom:6}}>Kết quả</div>
                    <div style={{fontSize:32,fontWeight:900,color:"#FBBF24"}}>{s1} – {s2}</div>
                    <div style={{fontSize:13,color:"#4ADE80",marginTop:6}}>🏆 {winner}</div>
                  </div>
                  {refGames.map((g,i)=>(
                    <div key={i} style={{fontSize:12,color:"#6B7280"}}>Game {i+1}: {g.t1||0} – {g.t2||0}</div>
                  ))}
                  <button onClick={handleRefExitMatch} style={{padding:"12px 32px",borderRadius:12,border:"none",background:"linear-gradient(90deg,#60A5FA,#3B82F6)",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:14,marginTop:8}}>
                    ← Nhập trận tiếp theo
                  </button>
                </div>
              );
            })()}

            {/* ── Match list ── */}
            {refTour&&!refMatch&&(
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {/* Tournament info */}
                <div style={{background:"rgba(96,165,250,0.08)",border:"1px solid rgba(96,165,250,0.2)",borderRadius:14,padding:"14px 16px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                    <div>
                      <div style={{fontWeight:800,fontSize:16,color:"#60A5FA"}}>{refTour.name}</div>
                      <div style={{fontSize:12,color:"#6B7280",marginTop:2}}>📅 {refTour.date} · {refTour.format==="double"?"👫 Đôi":refTour.format==="single"?"🎯 Đơn":"🔀 Hỗn hợp"} · Best of {refTour.bestOf||3}</div>
                    </div>
                    <span style={{padding:"4px 12px",borderRadius:20,background:"rgba(74,222,128,0.12)",color:"#4ADE80",fontSize:11,fontWeight:700,border:"1px solid rgba(74,222,128,0.25)"}}>● Đang diễn ra</span>
                  </div>
                </div>

                {/* New match button */}
                <button onClick={()=>{
                  const newM={id:Date.now(),round:(refTour.matches||[]).length+1,format:refTour.format,team1:[],team2:[],score1:0,score2:0,time:new Date().toLocaleString("vi-VN"),confirmed:false};
                  handleRefStartMatch(newM);
                }} style={{padding:"14px",borderRadius:12,border:"none",background:"linear-gradient(90deg,#60A5FA,#3B82F6)",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer",boxShadow:"0 4px 16px rgba(96,165,250,0.3)"}}>
                  ➕ Bắt đầu trận mới
                </button>

                {/* Existing matches */}
                {(refTour.matches||[]).length>0&&(
                  <div>
                    <div style={{fontSize:12,color:"#6B7280",fontWeight:700,marginBottom:8,letterSpacing:0.5}}>LỊCH SỬ TRẬN ({(refTour.matches||[]).length})</div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {[...(refTour.matches||[])].reverse().map((m,i)=>(
                        <div key={m.id||i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid "+(m.confirmed?"rgba(74,222,128,0.2)":"rgba(255,255,255,0.08)"),borderRadius:12,padding:"12px 14px"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                            <div style={{flex:1,fontSize:12}}>
                              <div style={{fontWeight:700,color:"#E5E7EB"}}>{m.team1?.join(" & ")||"?"}</div>
                              <div style={{color:"#6B7280",marginTop:2}}>vs {m.team2?.join(" & ")||"?"}</div>
                            </div>
                            <div style={{textAlign:"center",minWidth:60}}>
                              <div style={{fontSize:18,fontWeight:900,color:"#FBBF24"}}>{m.score1}–{m.score2}</div>
                              {m.confirmed&&<div style={{fontSize:9,color:"#4ADE80",fontWeight:700}}>✔ ĐÃ XÁC NHẬN</div>}
                            </div>
                            {!m.confirmed&&(
                              <button onClick={()=>handleRefStartMatch(m)} style={{padding:"8px 12px",borderRadius:8,border:"none",background:"rgba(96,165,250,0.15)",color:"#60A5FA",fontWeight:700,cursor:"pointer",fontSize:12,flexShrink:0}}>
                                ✏️ Nhập điểm
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {deleteConfirm&&can("canDeletePlayers")&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400,backdropFilter:"blur(6px)",padding:"20px"}} onClick={()=>setDeleteConfirm(null)}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",border:"1px solid rgba(239,68,68,0.4)",borderRadius:20,padding:"28px 24px",width:"100%",maxWidth:380,boxShadow:"0 24px 60px rgba(0,0,0,0.7)",textAlign:"center"}} onClick={e=>e.stopPropagation()}>
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


