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
    canApproveTourReg: true,
    canResetData: true,
    canManageRoles: true,
  },
  mod: {
    label:"Moderator",
    color:"#60A5FA",
    badge:"🛡 Mod",
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
  orange:"#FF6B35",orange2:"#FF8C5A",bg:"#111",bg2:"#181818",bg3:"#222",
  border:"rgba(255,107,53,0.2)",text:"#E5E7EB",muted:"#9CA3AF",dim:"#4B5563",
};

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

const MS = {
  width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,107,53,0.25)",
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
  const [tourForm,setTourForm]=useState({name:"",date:"",format:"double",rounds:"1",note:"",pin:"",bestOf:"3"});
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
    {key:"dashboard",icon:"📊",label:"Tổng quan"},
    {key:"players",icon:"👥",label:"VĐV"},
    {key:"ranking",icon:"🏆",label:"Xếp hạng"},
    {key:"tournament",icon:"🏅",label:"Giải đấu"},
    {key:"roles",icon:"🔐",label:"Phân quyền",adminOnly:true},

    {key:"history",icon:"📋",label:"Lịch sử"},
    {key:"rules",icon:"📜",label:"Quy định"},
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
      *,*::before,*::after{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
      html,body{margin:0;padding:0;overflow:hidden;height:100%;-webkit-text-size-adjust:100%;}
      body{overscroll-behavior-y:auto;}
      input,select,textarea,button{font-family:inherit;-webkit-appearance:none;appearance:none;}
      select{-webkit-appearance:none;appearance:none;}
      ::-webkit-scrollbar{width:4px;height:4px;}
      ::-webkit-scrollbar-track{background:transparent;}
      ::-webkit-scrollbar-thumb{background:rgba(255,107,53,0.3);border-radius:4px;}
      @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
    `;
    document.head.appendChild(el);
    return()=>document.head.removeChild(el);
  },[]);

  return (
    <>
    <div style={{height:"100dvh",background:"linear-gradient(160deg,#111 0%,#181818 60%,#222 100%)",color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif",overflowX:"hidden",overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
      <div style={{position:"fixed",top:-150,left:-150,width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,53,0.09) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:-120,right:-120,width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,180,71,0.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>

      <header style={{background:"rgba(13,13,13,0.97)",borderBottom:"1px solid "+C.border,position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 20px rgba(0,0,0,0.6)",paddingTop:"env(safe-area-inset-top,0px)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",maxWidth:900,margin:"0 auto",gap:8,minWidth:0}}>
          <div onClick={()=>setTab("dashboard")} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
            <img src="data:image/png;base64,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" alt="PickleBoom" style={{height:42,width:"auto",objectFit:"contain",filter:"drop-shadow(0 2px 6px rgba(255,107,53,0.4))"}} />
          </div>
          {isAdmin?(
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{textAlign:"right",minWidth:0,overflow:"hidden"}}>
                  <div style={{fontSize:10,color:ROLE_PERMISSIONS[userRole]?.color||"#FF6B35",fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ROLE_PERMISSIONS[userRole]?.badge||"🔐"} {auth.user.label}</div>
                  <div style={{fontSize:9,color:C.dim}}>Admin</div>
                </div>
                <button onClick={handleLogout} style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.35)",color:"#EF4444",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>Đăng xuất</button>
                <button onClick={()=>{if(can("canResetData")&&window.confirm("Reset toàn bộ dữ liệu về mặc định?"))handleResetData();}} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.dim,borderRadius:8,padding:"6px 8px",cursor:"pointer",fontSize:13,fontWeight:700,flexShrink:0}} title="Reset dữ liệu gốc">↺</button>
              </div>
              <div style={{fontSize:9,color:C.dim,letterSpacing:1}}><span style={{color:dbReady?"#4ADE80":"#FFB347"}}>{dbReady?"● Online":"● Connecting..."}</span></div>
            </div>
          ):(
<div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>{setRefMode(true);setRefTour(null);setRefPinInput("");setRefPinErr("");}} style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.35)",color:"#60A5FA",borderRadius:8,padding:"7px 10px",cursor:"pointer",fontSize:12,fontWeight:700}}>
                  🏳️ Trọng tài
                </button>
                <button onClick={()=>setAuth(a=>({...a,showLogin:true}))} style={{background:"rgba(255,107,53,0.12)",border:"1px solid rgba(255,107,53,0.35)",color:"#FF6B35",borderRadius:8,padding:"7px 12px",cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:5}}>
                  🔑 Đăng nhập
                </button>
              </div>
              <div style={{fontSize:9,color:C.dim,letterSpacing:1}}><span style={{color:dbReady?"#4ADE80":"#FFB347"}}>{dbReady?"● Online":"● Connecting..."}</span></div>
            </div>
          )}
        </div>
      </header>

      {syncing?(
        <div style={{position:"fixed",top:"calc(56px + env(safe-area-inset-top,0px))",left:"50%",transform:"translateX(-50%)",zIndex:299,padding:"6px 16px",borderRadius:20,background:"rgba(255,107,53,0.15)",border:"1px solid rgba(255,107,53,0.3)",fontSize:11,color:"#FF6B35",fontWeight:600,display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
          <span style={{display:"inline-block",animation:"spin 1s linear infinite"}}>⟳</span> Đang đồng bộ...
        </div>
      ):(
        <div style={{position:"fixed",top:"calc(56px + env(safe-area-inset-top,0px))",right:12,zIndex:299}}>
          <button onClick={loadFromDB} title="Tải lại dữ liệu từ server" style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:20,padding:"5px 12px",cursor:"pointer",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
            🔄 Tải lại
          </button>
        </div>
      )}

      {notif&&(
        <div style={{position:"fixed",top:"calc(64px + env(safe-area-inset-top,0px))",left:"50%",transform:"translateX(-50%)",zIndex:300,padding:"10px 20px",borderRadius:20,color:"#fff",fontSize:13,fontWeight:600,boxShadow:"0 8px 24px rgba(0,0,0,0.5)",background:notif.type==="ok"?"#FF6B35":"#EF4444",whiteSpace:"nowrap",maxWidth:"calc(100vw - 32px)",textAlign:"center",animation:"fadeIn 0.2s ease"}}>
          {notif.type==="ok"?"✓":"✗"} {notif.msg}
        </div>
      )}

      <main style={{maxWidth:900,margin:"0 auto",padding:"16px 12px calc(80px + env(safe-area-inset-bottom,0px))",position:"relative",zIndex:1}}>

        {tab==="dashboard"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{fontSize:18,fontWeight:800,color:C.orange}}>Tổng quan CLB</div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,width:"100%"}}>
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

        {tab==="players"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontSize:18,fontWeight:800,color:C.orange}}>VĐV ({filtered.length})</div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>{setShowRegModal(true);setRegSubmitted(false);setRegForm({name:"",email:"",pvna:"",gender:"male",phone:"",note:""}); }} style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.35)",color:"#60A5FA",borderRadius:10,padding:"9px 12px",cursor:"pointer",fontSize:13,fontWeight:700}}>📝 Đăng ký</button>
                {isAdmin&&can("canAddPlayers")&&(
                  <button onClick={()=>setShowAddModal(true)} style={{background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"9px 16px",cursor:"pointer",fontSize:13,fontWeight:700,boxShadow:"0 4px 12px rgba(255,107,53,0.35)"}}>+ Thêm</button>
                )}
              </div>
            </div>

            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <input placeholder="🔍 Tìm tên..." value={search} onChange={e=>setSearch(e.target.value)}
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
                    <div style={{width:32,height:32,borderRadius:10,background:"rgba(255,107,53,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <span style={{fontSize:14,color:p.gender==="male"?"#60A5FA":"#F9A8D4"}}>{p.gender==="male"?"♂":"♀"}</span>
                    </div>
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
                        📊
                      </button>
                      {isAdmin&&can("canAdjustScore")&&(
                        <button onClick={()=>{setAdjModal(p);setAdjForm({type:"",value:0,note:""}); }}
                          style={{background:"rgba(255,107,53,0.12)",border:"1px solid rgba(255,107,53,0.35)",color:C.orange,borderRadius:10,padding:"8px 10px",cursor:"pointer",fontSize:14,fontWeight:700}} title="Điều chỉnh điểm">
                          ⚡
                        </button>
                      )}
                      {isAdmin&&can("canEditPlayers")&&(
                        <button onClick={()=>{setEditModal(p);setEditForm({name:p.name,tier:p.tier,gender:p.gender,remark:p.remark||"",phone:p.phone||""});}}
                          style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.35)",color:"#60A5FA",borderRadius:10,padding:"8px 10px",cursor:"pointer",fontSize:14}} title="Sửa thông tin">
                          ✏️
                        </button>
                      )}
                      {isAdmin&&can("canDeletePlayers")&&(
                        <button onClick={()=>setDeleteConfirm(p)}
                          style={{background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.35)",color:"#EF4444",borderRadius:10,padding:"8px 10px",cursor:"pointer",fontSize:14}} title="Xóa VĐV">
                          🗑️
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
            <div style={{fontSize:18,fontWeight:800,color:C.orange}}>🏆 Xếp hạng</div>
            <div style={{display:"flex",gap:0,borderRadius:10,overflow:"hidden",border:"1px solid "+C.border}}>
              {["male","female"].map(g=>(
                <button key={g} onClick={()=>setRankGender(g)} style={{flex:1,padding:"10px",border:"none",cursor:"pointer",fontWeight:700,fontSize:13,background:rankGender===g?C.orange:"transparent",color:rankGender===g?"#fff":C.muted,transition:"all 0.2s"}}>
                  {g==="male"?"♂ Nam":"♀ Nữ"}
                </button>
              ))}
            </div>
            <Card>
              <SectionTitle>🥇 Bảng xếp hạng {rankGender==="male"?"Nam":"Nữ"}</SectionTitle>
              {(rankGender==="male"?[...players.male]:[...players.female]).sort((a,b)=>b.boom-a.boom).map((p,i)=>(
                <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 4px",borderBottom:"1px solid rgba(255,107,53,0.07)"}}>
                  <span style={{width:32,textAlign:"center",fontSize:i<3?20:13,flexShrink:0}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":"#"+(i+1)}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:14,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                    {p.remark&&<div style={{fontSize:10,color:"#FFB347",fontStyle:"italic",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.remark}</div>}
                  </div>
                  <TierChip tier={p.tier}/>
                  <BoomBadge boom={p.boom} tier={p.tier}/>
                  <button onClick={()=>setPlayerHistoryView(p.name)} style={{background:"rgba(255,107,53,0.1)",border:"none",color:C.orange,borderRadius:8,padding:"5px 8px",cursor:"pointer",fontSize:12}}>📊</button>
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
            <div style={{fontSize:18,fontWeight:800,color:C.orange}}>📋 Lịch sử</div>
            {/* Summary stats */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[
                {icon:"🏓",label:"Tổng trận",v:totalMatches,c:C.orange},
                {icon:"🏅",label:"Giải đấu",v:totalTours,c:"#60A5FA"},
                {icon:"🟢",label:"Đang diễn",v:activeTours,c:"#4ADE80"},
                {icon:"👥",label:"VĐV",v:totalPlayers,c:"#F9A8D4"},
              ].map((s,i)=>(
                <Card key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px"}}>
                  <span style={{fontSize:22,flexShrink:0}}>{s.icon}</span>
                  <div>
                    <div style={{fontSize:22,fontWeight:900,color:s.c,lineHeight:1}}>{s.v}</div>
                    <div style={{fontSize:11,color:C.muted,marginTop:2}}>{s.label}</div>
                  </div>
                </Card>
              ))}
            </div>
            {/* Recent matches */}
            <Card>
              <SectionTitle>🏓 Kết quả gần đây</SectionTitle>
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
                <SectionTitle>⚡ Nhật ký hệ thống</SectionTitle>
                {history.slice(0,20).map((h,i,arr)=>(
                  <div key={h.id||i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 0",borderBottom:i!==arr.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
                    <div style={{width:28,height:28,borderRadius:8,background:"rgba(255,107,53,0.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:12}}>
                      {h.action.includes("Thêm")?"➕":h.action.includes("Xóa")?"🗑️":h.action.includes("Sửa")?"✏️":h.action.includes("Tier")?"🏷️":h.action.includes("điểm")?"⚡":"📝"}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:600,color:C.text}}>{h.action}: <span style={{color:C.orange}}>{h.player}</span></div>
                      {h.detail&&<div style={{fontSize:11,color:C.muted,marginTop:1}}>{h.detail}</div>}
                      <div style={{fontSize:10,color:C.dim,marginTop:2}}>🕐 {h.time}</div>
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
            <div style={{fontSize:18,fontWeight:800,color:C.orange}}>🔐 Phân quyền</div>
            {ADMIN_CREDENTIALS.map((cred,i)=>{
              const rp=ROLE_PERMISSIONS[cred.role]||{};
              return(
                <Card key={i}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <div style={{width:36,height:36,borderRadius:10,background:"rgba(255,107,53,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{(rp.badge||"👤").split(" ")[0]}</div>
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
          <div style={{textAlign:"center",padding:48,color:C.dim}}>🔒 Chỉ Admin mới có quyền xem</div>
        )}


        {tab==="tournament"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontSize:18,fontWeight:800,color:C.orange}}>🏅 Giải đấu</div>
              {can("canCreateTournament")&&(
                <button onClick={()=>setShowTourModal(true)} style={{background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"9px 16px",cursor:"pointer",fontSize:13,fontWeight:700,boxShadow:"0 4px 12px rgba(255,107,53,0.35)"}}>+ Tạo giải</button>
              )}
            </div>
            {!tournaments.length&&<Card><div style={{textAlign:"center",color:C.dim,padding:24}}>Chưa có giải đấu nào</div></Card>}
            {tournaments.map(tour=>{
              const pendingCount=(tour.tourRegs||[]).filter(r=>r.status==="pending").length;
              const approvedCount=(tour.tourRegs||[]).filter(r=>r.status==="approved").length;
              return(
              <Card key={tour.id}>
                <div onClick={()=>setViewTour(tour)} style={{cursor:"pointer"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <div style={{fontWeight:800,fontSize:15,color:C.text,flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tour.name}</div>
                    <span style={{fontSize:10,padding:"3px 8px",borderRadius:10,fontWeight:700,background:tour.status==="active"?"rgba(74,222,128,0.15)":"rgba(107,114,128,0.15)",color:tour.status==="active"?"#4ADE80":"#6B7280",flexShrink:0,marginLeft:8}}>{tour.status==="active"?"🟢 Đang diễn":"⚫ Kết thúc"}</span>
                  </div>
                  <div style={{fontSize:11,color:C.dim,display:"flex",gap:10,flexWrap:"wrap",marginBottom:6}}>
                    <span>📅 {tour.date}</span>
                    <span>🎮 {tour.format==="single"?"Đơn":tour.format==="double"?"Đôi":"Hỗn hợp"}</span>
                    <span>🏓 {(tour.matches||[]).length} trận</span>
                    <span style={{color:"#4ADE80",fontWeight:600}}>✓ {approvedCount} VĐV</span>
                    {pendingCount&&can("canApproveTourReg")?<span style={{color:"#FBbF24",fontWeight:700}}>⏳ {pendingCount} chờ duyệt</span>:null}
                  </div>
                  {tour.note&&<div style={{fontSize:11,color:C.muted,fontStyle:"italic"}}>{tour.note}</div>}
                </div>
                <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
                  {tour.status==="active"&&(
                    <button onClick={e=>{e.stopPropagation();setShowTourRegForm(tour);setTourRegForm({tourId:String(tour.id),playerName:"",contact:"",content:tour.format==="single"?"single":"double",partner:"",note:""}); setTourRegSubmitted(false);}} style={{flex:1,background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:8,padding:"8px",cursor:"pointer",fontSize:12,fontWeight:700}}>
                      📝 Đăng ký thi đấu
                    </button>
                  )}
                  {can("canManageTournament")&&(
                    <>
                      <button onClick={e=>{e.stopPropagation();setActiveTour(tour);setViewTour(tour);}} style={{background:"rgba(255,107,53,0.12)",border:"1px solid rgba(255,107,53,0.35)",color:C.orange,borderRadius:8,padding:"8px 10px",cursor:"pointer",fontSize:12,fontWeight:700}}>⚙️</button>
                      <button onClick={e=>{e.stopPropagation();setEditTourModal({tour,form:{name:tour.name,date:tour.date,format:tour.format,rounds:String(tour.rounds||1),note:tour.note||"",pin:tour.pin||"",bestOf:String(tour.bestOf||3)}});}} style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.35)",color:"#60A5FA",borderRadius:8,padding:"8px 10px",cursor:"pointer",fontSize:12}}>✏️</button>
                      {tour.status==="active"&&<button onClick={e=>{e.stopPropagation();if(window.confirm("Kết thúc giải "+tour.name+"?"))handleEndTour(tour);}} style={{background:"rgba(251,191,36,0.12)",border:"1px solid rgba(251,191,36,0.35)",color:"#FBbF24",borderRadius:8,padding:"8px 10px",cursor:"pointer",fontSize:12}}>🏁</button>}
                      <button onClick={e=>{e.stopPropagation();if(window.confirm("Xóa giải "+tour.name+"?"))handleDeleteTour(tour);}} style={{background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.35)",color:"#EF4444",borderRadius:8,padding:"8px 10px",cursor:"pointer",fontSize:12}}>🗑️</button>
                    </>
                  )}
                </div>
              </Card>
              );
            })}
            {viewTour&&(
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:200,animation:"fadeIn 0.2s ease"}}>
                <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"90vh",overflowY:"auto",padding:20,border:"1px solid "+C.border}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                    <div style={{fontWeight:800,fontSize:16,color:C.orange,flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{viewTour.name}</div>
                    <button onClick={()=>setViewTour(null)} style={{background:"transparent",border:"none",color:C.dim,cursor:"pointer",fontSize:22,marginLeft:8}}>✕</button>
                  </div>
                  <div style={{fontSize:11,color:C.dim,display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
                    <span>📅 {viewTour.date}</span>
                    <span>🎮 {viewTour.format==="single"?"Đơn":viewTour.format==="double"?"Đôi":"Hỗn hợp"}</span>
                    <span style={{color:viewTour.status==="active"?"#4ADE80":"#6B7280"}}>{viewTour.status==="active"?"🟢 Đang diễn":"⚫ Kết thúc"}</span>
                  </div>
                  {(can("canManageTournament")||can("canApproveTourReg"))&&(
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
                      {can("canManageTournament")&&viewTour.status==="active"&&<button onClick={()=>setShowMatchModal(true)} style={{background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:700}}>+ Thêm trận</button>}
                      {can("canManageTournament")&&<button onClick={()=>openGroupDraw(viewTour)} style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.35)",color:"#60A5FA",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:700}}>🎯 Chia bảng</button>}
                      <button onClick={()=>setShowTourRegAdmin(viewTour)} style={{position:"relative",background:"rgba(251,191,36,0.12)",border:"1px solid rgba(251,191,36,0.35)",color:"#FBbF24",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:700}}>
                        📋 DS Đăng ký
                        {(viewTour.tourRegs||[]).filter(r=>r.status==="pending").length?<span style={{position:"absolute",top:-6,right:-6,background:"#EF4444",color:"#fff",borderRadius:20,fontSize:9,fontWeight:900,padding:"1px 5px",minWidth:16,textAlign:"center"}}>{(viewTour.tourRegs||[]).filter(r=>r.status==="pending").length}</span>:null}
                      </button>
                      {can("canManageTournament")&&viewTour.status==="active"&&<button onClick={()=>{if(window.confirm("Kết thúc giải?"))handleEndTour(viewTour);}} style={{background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.35)",color:"#EF4444",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:700}}>🏁 Kết thúc</button>}
                    </div>
                  )}
                  {!!(viewTour.groups||[]).length&&(
                    <div style={{marginBottom:14}}>
                      <SectionTitle>🎯 Bảng đấu</SectionTitle>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8}}>
                        {(viewTour.groups||[]).map((g,gi)=>(
                          <div key={gi} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:10,border:"1px solid rgba(255,107,53,0.15)"}}>
                            <div style={{fontWeight:700,fontSize:12,color:C.orange,marginBottom:6}}>{g.name}</div>
                            {(g.players||[]).map((pn,pi)=><div key={pi} style={{fontSize:11,color:C.text,padding:"2px 0",borderBottom:pi!==g.players.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>{pn}</div>)}
                          </div>
                        ))}
                      </div>
                      {can("canManageTournament")&&<button onClick={()=>handleDeleteGroups(viewTour)} style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",color:"#EF4444",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:11,fontWeight:700,marginTop:8}}>🗑️ Xóa bảng</button>}
                    </div>
                  )}
                  {!!(viewTour.matches||[]).length&&(
                    <div>
                      <SectionTitle>🏓 Kết quả ({(viewTour.matches||[]).length} trận)</SectionTitle>
                      {[...viewTour.matches].reverse().map((m,i)=>(
                        <div key={m.id||i} style={{padding:"10px 0",borderBottom:i!==viewTour.matches.length-1?"1px solid rgba(255,107,53,0.07)":"none"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <span style={{fontSize:10,color:C.dim,flexShrink:0}}>R{m.round}</span>
                            <div style={{flex:1,display:"flex",alignItems:"center",gap:6,minWidth:0}}>
                              <span style={{flex:1,fontSize:12,fontWeight:600,color:m.score1>m.score2?C.orange:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"right"}}>{(m.team1||[]).join(" & ")}</span>
                              <span style={{fontWeight:900,fontSize:15,color:C.text,flexShrink:0,padding:"2px 8px",background:"rgba(255,255,255,0.06)",borderRadius:6}}>{m.score1} - {m.score2}</span>
                              <span style={{flex:1,fontSize:12,fontWeight:600,color:m.score2>m.score1?C.orange:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(m.team2||[]).join(" & ")}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {!(viewTour.matches||[]).length&&<div style={{textAlign:"center",color:C.dim,padding:20,fontSize:13}}>Chưa có trận đấu nào</div>}
                </div>
              </div>
            )}
            {showTourRegAdmin&&(
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:201,animation:"fadeIn 0.2s ease"}}>
                <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"92vh",display:"flex",flexDirection:"column",border:"1px solid "+C.border}}>
                  {/* Handle bar */}
                  <div style={{width:40,height:4,background:"rgba(255,255,255,0.15)",borderRadius:4,margin:"12px auto 0",flexShrink:0}}/>
                  {/* Header */}
                  <div style={{padding:"12px 20px 0",flexShrink:0}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                      <div>
                        <div style={{fontWeight:800,fontSize:15,color:C.orange}}>📋 Danh sách đăng ký</div>
                        <div style={{fontSize:11,color:C.dim,marginTop:2}}>{showTourRegAdmin.name} · {showTourRegAdmin.date}</div>
                      </div>
                      <button onClick={()=>{setShowTourRegAdmin(null);setTourRegAdminTab("pending");}} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:C.muted,borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:13,fontWeight:700}}>✕ Đóng</button>
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
                          <div style={{fontSize:36,marginBottom:10}}>{tourRegAdminTab==="pending"?"⏳":tourRegAdminTab==="approved"?"✅":"🚫"}</div>
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
                            <div style={{width:42,height:42,borderRadius:12,background:r.content==="single"?"rgba(255,107,53,0.12)":"rgba(96,165,250,0.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:20}}>
                              {r.content==="single"?"🎾":"🎽"}
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
                                  <span style={{fontSize:10,color:C.dim,flexShrink:0}}>🤝 Đồng đội:</span>
                                  <span style={{fontWeight:700,fontSize:13,color:C.text}}>{r.partner}</span>
                                  {p2&&<TierChip tier={p2.tier}/>}
                                  {p2&&<span style={{fontSize:11,color:TIER_COLORS[p2.tier],fontWeight:700}}>{p2.boom.toFixed(2)}</span>}
                                  {!p2&&<span style={{fontSize:10,color:C.dim,fontStyle:"italic"}}>Chưa có trong hệ thống</span>}
                                </div>
                              )}
                              {/* Meta */}
                              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:5}}>
                                <span style={{fontSize:10,color:C.dim}}>🕐 {r.time}</span>
                                {r.phone&&<span style={{fontSize:10,color:"#60A5FA"}}>📱 {r.phone}</span>}
                          {r.note&&<span style={{fontSize:10,color:"#FFB347",fontStyle:"italic"}}>💬 {r.note}</span>}
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
            <div style={{borderRadius:18,background:"linear-gradient(135deg,rgba(255,107,53,0.18) 0%,rgba(255,180,71,0.1) 100%)",border:"1px solid rgba(255,107,53,0.3)",padding:"24px 20px",textAlign:"center",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,53,0.15),transparent 70%)",pointerEvents:"none"}}/>
              <div style={{fontSize:40,marginBottom:8}}>🏓</div>
              <div style={{fontSize:22,fontWeight:900,letterSpacing:2,background:"linear-gradient(90deg,#FF6B35,#FFB347)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>PICKLEBOOM</div>
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
              <SectionTitle>🏅 Bảng phân hạng BOOM</SectionTitle>
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
                    <div style={{fontSize:12,color:"#60A5FA",fontWeight:700,textAlign:"center",alignSelf:"center"}}>{row.male.toFixed(2)}</div>
                    <div style={{fontSize:12,color:"#F9A8D4",fontWeight:700,textAlign:"center",alignSelf:"center"}}>{row.female!=null?row.female.toFixed(2):"—"}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:10,color:C.dim,marginTop:10,lineHeight:1.6}}>
                💡 Điểm BOOM được cập nhật sau mỗi giải đấu chính thức. Điểm khởi điểm: Nam 2.50 · Nữ 2.10
              </div>
            </Card>

            {/* Rules */}
            <Card>
              <SectionTitle>📋 Quy định chung</SectionTitle>
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
                    <span style={{fontSize:11,fontWeight:900,color:C.orange,flexShrink:0,width:24,height:24,borderRadius:"50%",background:"rgba(255,107,53,0.12)",display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>{r.num}</span>
                    <span style={{fontSize:13,color:C.muted,lineHeight:1.6}}>{r.text}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Contact */}
            <Card style={{background:"rgba(255,107,53,0.05)",border:"1px solid rgba(255,107,53,0.2)"}}>
              <SectionTitle>📞 Liên hệ</SectionTitle>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[
                  {icon:"📍",label:"Địa điểm","value":"Đà Nẵng, Việt Nam"},
                  {icon:"📘",label:"Fanpage","value":"facebook.com/pickleboomdn"},
                  {icon:"✉️",label:"Email","value":"pickleboom@gmail.com"},
                ].map((c,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:16,flexShrink:0,width:28,textAlign:"center"}}>{c.icon}</span>
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
          <div onClick={e=>e.stopPropagation()} style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"88vh",display:"flex",flexDirection:"column",border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.15)",borderRadius:4,margin:"12px auto 0",flexShrink:0}}/>
            {/* Header */}
            <div style={{padding:"14px 20px 0",flexShrink:0}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <div>
                  <div style={{fontWeight:900,fontSize:16,color:C.text}}>{playerHistoryView}</div>
                  {pl&&<div style={{display:"flex",gap:6,marginTop:5,alignItems:"center",flexWrap:"wrap"}}><TierChip tier={pl.tier}/><BoomBadge boom={pl.boom} tier={pl.tier}/><span style={{fontSize:10,color:C.dim}}>{pl.gender==="male"?"♂ Nam":"♀ Nữ"}</span>{pl.phone&&<span style={{fontSize:11,color:C.muted,background:"rgba(255,255,255,0.06)",borderRadius:6,padding:"1px 7px"}}>📱 {pl.phone}</span>}</div>}
                </div>
                <button onClick={()=>setPlayerHistoryView(null)} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:C.muted,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:13,fontWeight:700}}>✕ Đóng</button>
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
                  <div style={{fontSize:36,marginBottom:10}}>🏓</div>
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
          <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"92vh",display:"flex",flexDirection:"column",border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.15)",borderRadius:4,margin:"12px auto 0",flexShrink:0}}/>
            <div style={{padding:"12px 20px 0",flexShrink:0}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <div style={{fontWeight:800,fontSize:16,color:"#60A5FA"}}>📝 Đăng ký thành viên</div>
                <button onClick={()=>{setShowRegModal(false);setRegSubmitted(false);}} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:C.muted,borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:13,fontWeight:700}}>✕ Đóng</button>
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
                      if(dup) return <div style={{fontSize:11,color:"#EF4444",marginTop:4,fontWeight:600}}>⚠️ SĐT đã có trong hệ thống: {dup.name}</div>;
                      if(dupReg) return <div style={{fontSize:11,color:"#FBbF24",marginTop:4,fontWeight:600}}>⏳ SĐT đang chờ duyệt: {dupReg.name}</div>;
                      return null;
                    })()}
                  </div>
                  <select value={regForm.gender} onChange={e=>setRegForm(f=>({...f,gender:e.target.value}))} style={MS}>
                    <option value="male">♂ Nam</option><option value="female">♀ Nữ</option>
                  </select>
                  <input placeholder="Email (tùy chọn)" value={regForm.email} onChange={e=>setRegForm(f=>({...f,email:e.target.value}))} style={MS}/>
                  <input placeholder="Điểm trình PVNA (tùy chọn)" value={regForm.pvna} onChange={e=>setRegForm(f=>({...f,pvna:e.target.value}))} style={MS}/>
                  <input placeholder="Ghi chú (tùy chọn)" value={regForm.note} onChange={e=>setRegForm(f=>({...f,note:e.target.value}))} style={MS}/>
                  <button onClick={handleRegister} disabled={regLoading||!!allPlayers.find(p=>p.phone===regForm.phone.trim())} style={{background:"linear-gradient(90deg,#60A5FA,#3B82F6)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700,boxShadow:"0 4px 12px rgba(96,165,250,0.3)",opacity:(regLoading||!!allPlayers.find(p=>p.phone===regForm.phone.trim()))?0.5:1,marginTop:4}}>
                    {regLoading?"Đang gửi...":"📝 Gửi đăng ký"}
                  </button>
                  {isAdmin&&can("canApproveReg")&&!!regList.length&&(
                    <div style={{marginTop:8}}>
                      <div style={{fontSize:12,color:C.muted,fontWeight:600,marginBottom:8}}>Danh sách đăng ký ({regList.length})</div>
                      {regList.map((r,i)=>(
                        <div key={r.id||i} style={{padding:"10px 0",borderBottom:i!==regList.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontWeight:700,fontSize:13,color:C.text}}>{r.name} <span style={{color:r.gender==="male"?"#60A5FA":"#F9A8D4",fontSize:11}}>{r.gender==="male"?"♂":"♀"}</span></div>
                              {r.phone&&<div style={{fontSize:11,color:"#60A5FA"}}>📱 {r.phone}</div>}
                          <div style={{fontSize:11,color:C.muted}}>{r.email&&r.email+" · "}{r.pvna&&"PVNA: "+r.pvna}</div>
                              <div style={{fontSize:10,color:C.dim,marginTop:2}}>🕐 {r.time}</div>
                            </div>
                            <span style={{fontSize:10,padding:"3px 8px",borderRadius:10,fontWeight:700,background:r.status==="approved"?"rgba(74,222,128,0.15)":r.status==="rejected"?"rgba(239,68,68,0.15)":"rgba(251,191,36,0.15)",color:r.status==="approved"?"#4ADE80":r.status==="rejected"?"#EF4444":"#FBbF24",flexShrink:0}}>{r.status==="approved"?"✓ Duyệt":r.status==="rejected"?"✗ Từ chối":"⏳ Chờ"}</span>
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
                  <div style={{fontSize:48,marginBottom:12}}>✅</div>
                  <div style={{fontSize:16,fontWeight:700,color:"#4ADE80",marginBottom:8}}>Đã gửi đăng ký!</div>
                  <div style={{fontSize:13,color:C.muted,marginBottom:20}}>Chúng tôi sẽ xem xét và liên hệ qua email.</div>
                  <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                    <button onClick={()=>setRegSubmitted(false)} style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.35)",color:"#60A5FA",borderRadius:10,padding:"10px 20px",cursor:"pointer",fontSize:13,fontWeight:700}}>Đăng ký thêm</button>
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
          <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 16px"}}/>
            <SectionTitle>➕ Thêm VĐV mới</SectionTitle>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input placeholder="Họ tên *" value={newPlayer.name} onChange={e=>setNewPlayer(p=>({...p,name:e.target.value}))} style={MS}/>
              <div style={{display:"flex",gap:8}}>
                <select value={newPlayer.tier} onChange={e=>setNewPlayer(p=>({...p,tier:e.target.value}))} style={{...MS,flex:1}}>
                  {TIERS.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
                <select value={newPlayer.gender} onChange={e=>setNewPlayer(p=>({...p,gender:e.target.value}))} style={{...MS,flex:1}}>
                  <option value="male">♂ Nam</option><option value="female">♀ Nữ</option>
                </select>
              </div>
              <input placeholder="📱 Số điện thoại (tùy chọn)" value={newPlayer.phone} onChange={e=>setNewPlayer(p=>({...p,phone:e.target.value}))} style={MS} inputMode="tel"/>
              <input placeholder="Ghi chú (tùy chọn)" value={newPlayer.remark} onChange={e=>setNewPlayer(p=>({...p,remark:e.target.value}))} style={MS}/>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setShowAddModal(false)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
                <button onClick={handleAddPlayer} style={{flex:2,background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Thêm VĐV</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {adjModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",zIndex:200,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 16px"}}/>
            <SectionTitle>⚡ Điều chỉnh điểm: {adjModal.name}</SectionTitle>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,padding:"10px 14px",borderRadius:10,background:"rgba(255,107,53,0.06)",border:"1px solid rgba(255,107,53,0.2)"}}>
              <TierChip tier={adjModal.tier}/>
              <span style={{fontWeight:700,fontSize:14}}>{adjModal.name}</span>
              <BoomBadge boom={adjModal.boom} tier={adjModal.tier}/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <select value={adjForm.type} onChange={e=>setAdjForm(f=>({...f,type:e.target.value}))} style={MS}>
                <option value="">Loại điều chỉnh</option>
                <option value="Vô địch giải">🥇 Vô địch giải</option>
                <option value="Á quân giải">🥈 Á quân giải</option>
                <option value="Hạng 3 giải">🥉 Hạng 3 giải</option>
                <option value="Thăng Tier">⬆️ Thăng Tier</option>
                <option value="Hạ Tier">⬇️ Hạ Tier</option>
                <option value="Điều chỉnh thủ công">✏️ Thủ công</option>
              </select>
              <input type="number" placeholder="Giá trị (+/-)" value={adjForm.value} onChange={e=>setAdjForm(f=>({...f,value:e.target.value}))} style={MS} step="0.01"/>
              <input placeholder="Ghi chú" value={adjForm.note} onChange={e=>setAdjForm(f=>({...f,note:e.target.value}))} style={MS}/>
              <div style={{fontSize:12,color:C.muted,textAlign:"center"}}>
                Điểm mới: <strong style={{color:C.orange}}>{(adjModal.boom+(parseFloat(adjForm.value)||0)).toFixed(3)}</strong>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setAdjModal(null)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
                <button onClick={handleAdjust} style={{flex:2,background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Lưu điều chỉnh</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",zIndex:200,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 16px"}}/>
            <SectionTitle>✏️ Sửa VĐV: {editModal.name}</SectionTitle>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input placeholder="Họ tên" value={editForm.name} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))} style={MS}/>
              <div style={{display:"flex",gap:8}}>
                <select value={editForm.tier} onChange={e=>setEditForm(f=>({...f,tier:e.target.value}))} style={{...MS,flex:1}}>
                  {TIERS.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
                <select value={editForm.gender} onChange={e=>setEditForm(f=>({...f,gender:e.target.value}))} style={{...MS,flex:1}}>
                  <option value="male">♂ Nam</option><option value="female">♀ Nữ</option>
                </select>
              </div>
              <input placeholder="📱 Số điện thoại" value={editForm.phone} onChange={e=>setEditForm(f=>({...f,phone:e.target.value}))} style={MS} inputMode="tel"/>
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
          <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:18,width:"100%",maxWidth:340,padding:24,border:"1px solid rgba(239,68,68,0.3)"}}>
            <div style={{fontSize:36,textAlign:"center",marginBottom:12}}>🗑️</div>
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
          <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 16px"}}/>
            <SectionTitle>🔑 Đăng nhập Admin</SectionTitle>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input placeholder="Tên đăng nhập" value={auth.u} onChange={e=>setAuth(a=>({...a,u:e.target.value}))} style={MS} autoCapitalize="none"/>
              <input placeholder="Mật khẩu" type="password" value={auth.p} onChange={e=>setAuth(a=>({...a,p:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={MS}/>
              {auth.err&&<div style={{color:"#EF4444",fontSize:12,textAlign:"center"}}>{auth.err}</div>}
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setAuth(a=>({...a,showLogin:false,err:"",u:"",p:""}))} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
                <button onClick={handleLogin} style={{flex:2,background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Đăng nhập</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTourModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:200,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"80vh",overflowY:"auto",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 16px"}}/>
            <SectionTitle>🏅 Tạo giải đấu mới</SectionTitle>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
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
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setShowTourModal(false)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
                <button onClick={handleCreateTour} style={{flex:2,background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Tạo giải</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editTourModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:202,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"80vh",overflowY:"auto",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 16px"}}/>
            <SectionTitle>✏️ Sửa giải: {editTourModal.tour.name}</SectionTitle>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
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
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setEditTourModal(null)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
                <button onClick={handleUpdateTour} style={{flex:2,background:"linear-gradient(90deg,#60A5FA,#3B82F6)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Lưu thay đổi</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMatchModal&&activeTour&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:202,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"85vh",overflowY:"auto",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 16px"}}/>
            <SectionTitle>🏓 Thêm kết quả trận</SectionTitle>
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
                <button onClick={handleAddMatch} style={{flex:2,background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Lưu kết quả</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTourRegForm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"flex-end",zIndex:220,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"90vh",overflowY:"auto",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.15)",borderRadius:4,margin:"0 auto 16px"}}/>
            {!tourRegSubmitted?(
              <div>
                <div style={{marginBottom:16}}>
                  <div style={{fontWeight:900,fontSize:16,color:C.orange,marginBottom:4}}>📝 Đăng ký thi đấu</div>
                  <div style={{fontSize:12,color:C.dim,padding:"8px 12px",borderRadius:8,background:"rgba(255,107,53,0.06)",border:"1px solid rgba(255,107,53,0.2)"}}>
                    🏅 {showTourRegForm.name} · 📅 {showTourRegForm.date} · 🎮 {showTourRegForm.format==="single"?"Đơn":showTourRegForm.format==="double"?"Đôi":"Hỗn hợp"}
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{position:"relative"}}>
                    <div style={{fontSize:11,color:C.muted,marginBottom:5,fontWeight:600}}>Họ tên VĐV *</div>
                    <input
                      placeholder="Tìm tên VĐV trong hệ thống..."
                      value={tourRegForm.playerName}
                      onChange={e=>{setTourRegForm(f=>({...f,playerName:e.target.value}));setRegPlayerFocus(true);}}
                      onFocus={()=>setRegPlayerFocus(true)}
                      onBlur={()=>setTimeout(()=>setRegPlayerFocus(false),180)}
                      style={{...MS}}
                      autoComplete="off"
                    />
                    {regPlayerFocus&&(
                      <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:999,background:"#1e1e1e",border:"1px solid "+C.border,borderRadius:10,maxHeight:200,overflowY:"auto",boxShadow:"0 8px 24px rgba(0,0,0,0.6)",marginTop:4}}>
                        {allPlayers
                          .filter(p=>!tourRegForm.playerName||p.name.toLowerCase().includes(tourRegForm.playerName.toLowerCase()))
                          .slice(0,20)
                          .map(p=>(
                          <div key={p.id} onMouseDown={()=>{setTourRegForm(f=>({...f,playerName:p.name}));setRegPlayerFocus(false);}}
                            style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.05)",transition:"background 0.1s"}}
                            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,107,53,0.1)"}
                            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                            <span style={{fontSize:12,color:p.gender==="male"?"#60A5FA":"#F9A8D4",flexShrink:0}}>{p.gender==="male"?"♂":"♀"}</span>
                            <span style={{flex:1,fontSize:14,fontWeight:600,color:C.text}}>{p.name}</span>
                            <TierChip tier={p.tier}/>
                            <BoomBadge boom={p.boom} tier={p.tier}/>
                          </div>
                        ))}
                        {allPlayers.filter(p=>!tourRegForm.playerName||p.name.toLowerCase().includes(tourRegForm.playerName.toLowerCase())).length===0&&(
                          <div style={{padding:"12px 14px",fontSize:13,color:C.dim,textAlign:"center"}}>Không tìm thấy VĐV</div>
                        )}
                      </div>
                    )}
                  </div>
                  {showTourRegForm.format!=="single"&&(
                    <div>
                      <div style={{fontSize:11,color:C.muted,marginBottom:5,fontWeight:600}}>Hình thức đăng ký</div>
                      <div style={{display:"flex",gap:8}}>
                        {["single","double"].map(ct=>(
                          <button key={ct} onClick={()=>setTourRegForm(f=>({...f,content:ct,partner:ct==="single"?"":f.partner}))}
                            style={{flex:1,padding:"10px",borderRadius:10,border:"1px solid "+(tourRegForm.content===ct?C.orange:"rgba(255,255,255,0.12)"),background:tourRegForm.content===ct?"rgba(255,107,53,0.12)":"transparent",color:tourRegForm.content===ct?C.orange:C.muted,cursor:"pointer",fontWeight:700,fontSize:13}}>
                            {ct==="single"?"🎾 Đánh đơn":"🎽 Đánh đôi"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {tourRegForm.content==="double"&&(
                    <div style={{position:"relative"}}>
                      <div style={{fontSize:11,color:C.muted,marginBottom:5,fontWeight:600}}>Tên đồng đội *</div>
                      <input
                        placeholder="Tìm tên đồng đội trong hệ thống..."
                        value={tourRegForm.partner}
                        onChange={e=>{setTourRegForm(f=>({...f,partner:e.target.value}));setRegPartnerFocus(true);}}
                        onFocus={()=>setRegPartnerFocus(true)}
                        onBlur={()=>setTimeout(()=>setRegPartnerFocus(false),180)}
                        style={{...MS}}
                        autoComplete="off"
                      />
                      {regPartnerFocus&&(
                        <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:999,background:"#1e1e1e",border:"1px solid "+C.border,borderRadius:10,maxHeight:200,overflowY:"auto",boxShadow:"0 8px 24px rgba(0,0,0,0.6)",marginTop:4}}>
                          {allPlayers
                            .filter(p=>p.name!==tourRegForm.playerName&&(!tourRegForm.partner||p.name.toLowerCase().includes(tourRegForm.partner.toLowerCase())))
                            .slice(0,20)
                            .map(p=>(
                            <div key={p.id} onMouseDown={()=>{setTourRegForm(f=>({...f,partner:p.name}));setRegPartnerFocus(false);}}
                              style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.05)",transition:"background 0.1s"}}
                              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,107,53,0.1)"}
                              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                              <span style={{fontSize:12,color:p.gender==="male"?"#60A5FA":"#F9A8D4",flexShrink:0}}>{p.gender==="male"?"♂":"♀"}</span>
                              <span style={{flex:1,fontSize:14,fontWeight:600,color:C.text}}>{p.name}</span>
                              <TierChip tier={p.tier}/>
                              <BoomBadge boom={p.boom} tier={p.tier}/>
                            </div>
                          ))}
                          {allPlayers.filter(p=>p.name!==tourRegForm.playerName&&(!tourRegForm.partner||p.name.toLowerCase().includes(tourRegForm.partner.toLowerCase()))).length===0&&(
                            <div style={{padding:"12px 14px",fontSize:13,color:C.dim,textAlign:"center"}}>Không tìm thấy VĐV</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <div style={{fontSize:11,color:C.muted,marginBottom:5,fontWeight:600}}>Ghi chú (tùy chọn)</div>
                    <input placeholder="Yêu cầu đặc biệt, hạng dự thi..." value={tourRegForm.note} onChange={e=>setTourRegForm(f=>({...f,note:e.target.value}))} style={{...MS}}/>
                  </div>
                  <div style={{fontSize:11,color:C.dim,padding:"8px 12px",borderRadius:8,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
                    ℹ️ Đăng ký sẽ được Admin/Mod xét duyệt. Bạn sẽ được thông báo kết quả.
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:4}}>
                    <button onClick={()=>{setShowTourRegForm(null);setTourRegSubmitted(false);}} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
                    <button onClick={async()=>{
                      if(!tourRegForm.playerName.trim()){showNotif("Vui lòng nhập họ tên","err");return;}
                      if(tourRegForm.content==="double"&&!tourRegForm.partner.trim()){showNotif("Vui lòng nhập tên đồng đội","err");return;}
                      await handleTourRegister();
                    }} style={{flex:2,background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700,boxShadow:"0 4px 12px rgba(255,107,53,0.35)"}}>
                      📝 Gửi đăng ký
                    </button>
                  </div>
                </div>
              </div>
            ):(
              <div style={{textAlign:"center",padding:"32px 16px"}}>
                <div style={{fontSize:52,marginBottom:12}}>🎉</div>
                <div style={{fontSize:18,fontWeight:900,color:"#4ADE80",marginBottom:8}}>Đăng ký thành công!</div>
                <div style={{fontSize:13,color:C.muted,marginBottom:6,lineHeight:1.6}}>
                  Yêu cầu đăng ký của bạn đã được ghi nhận.
                </div>
                <div style={{fontSize:12,color:C.dim,padding:"10px 16px",borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",marginBottom:20,lineHeight:1.7}}>
                  🏅 <strong style={{color:C.orange}}>{showTourRegForm.name}</strong><br/>
                  📅 {showTourRegForm.date}<br/>
                  ⏳ Đang chờ Admin/Mod xét duyệt
                </div>
                <button onClick={()=>{setShowTourRegForm(null);setTourRegSubmitted(false);}} style={{background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"12px 32px",cursor:"pointer",fontSize:15,fontWeight:700}}>
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showGroupDrawModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:202,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"85vh",overflowY:"auto",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 16px"}}/>
            <SectionTitle>🎯 Chia bảng: {showGroupDrawModal.name}</SectionTitle>
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
                    style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,cursor:"pointer",background:p.selected?"rgba(255,107,53,0.1)":"rgba(255,255,255,0.04)",border:"1px solid "+(p.selected?"rgba(255,107,53,0.3)":"rgba(255,255,255,0.08)")}}>
                    <span style={{fontSize:14}}>{p.selected?"✓":"○"}</span>
                    <span style={{fontSize:13,flex:1}}>{p.name}</span>
                    <span style={{fontSize:10,color:C.dim}}>{p.boom.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setShowGroupDrawModal(null)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
                <button onClick={handleGenerateGroups} style={{flex:2,background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>🎯 Chia bảng</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {refMode&&(
        <div style={{position:"fixed",inset:0,background:"#0d0d0d",zIndex:999,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{background:"rgba(13,13,13,0.97)",borderBottom:"1px solid "+C.border,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontWeight:900,fontSize:16,color:C.orange}}>🏳️ Chế độ Trọng tài</div>
            <button onClick={()=>{setRefMode(false);setRefTour(null);setRefMatch(null);setRefGames([]);setRefConfirmed(false);}} style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.35)",color:"#EF4444",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:700}}>✕ Thoát</button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:16}}>
            {!refTour&&(
              <div style={{display:"flex",flexDirection:"column",gap:16,paddingTop:24}}>
                <div style={{textAlign:"center",fontSize:36,marginBottom:8}}>🔑</div>
                <div style={{textAlign:"center",fontWeight:700,fontSize:16,color:C.text}}>Nhập mã PIN giải đấu</div>
                <input placeholder="Mã PIN 4 chữ số" value={refPinInput} onChange={e=>setRefPinInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleRefPinSubmit()} style={{...MS,textAlign:"center",fontSize:24,letterSpacing:8,fontWeight:900}} maxLength={6} inputMode="numeric"/>
                {refPinErr&&<div style={{color:"#EF4444",fontSize:12,textAlign:"center"}}>{refPinErr}</div>}
                <button onClick={handleRefPinSubmit} style={{background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"14px",cursor:"pointer",fontSize:16,fontWeight:700}}>Xác nhận PIN</button>
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
                      <span style={{fontWeight:900,fontSize:16,color:C.orange,flexShrink:0,padding:"2px 10px",background:"rgba(255,107,53,0.1)",borderRadius:6}}>{m.score1} - {m.score2}</span>
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
                <button onClick={handleRefSaveMatch} style={{background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"16px",cursor:"pointer",fontSize:16,fontWeight:700,boxShadow:"0 4px 16px rgba(255,107,53,0.4)"}}>
                  {refConfirmed?"🔄 Cập nhật lại":"💾 Xác nhận kết quả"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <nav style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(13,13,13,0.97)",borderTop:"1px solid "+C.border,display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom,0px)",boxShadow:"0 -4px 24px rgba(0,0,0,0.5)"}}>
        {NAV.filter(t=>!t.adminOnly||isAdmin).map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)}
            style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"10px 2px 7px",border:"none",background:"transparent",cursor:"pointer",color:tab===t.key?C.orange:C.dim,transition:"color 0.2s",position:"relative",minHeight:52}}>
            {tab===t.key&&<div style={{position:"absolute",top:0,left:"25%",right:"25%",height:2,background:C.orange,borderRadius:2}}/>}
            <span style={{fontSize:18,lineHeight:1}}>{t.icon}</span>
            <span style={{fontSize:"clamp(8px,2.2vw,10px)",fontWeight:tab===t.key?700:500,letterSpacing:0.2,whiteSpace:"nowrap"}}>{t.label}</span>
          </button>
        ))}
      </nav>


    </div>
    </>
  );
}