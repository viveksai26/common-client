(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{"4n2y":function(t,e,o){"use strict";o.r(e),o.d(e,"LoginModule",(function(){return S}));var r=o("a6SJ"),n=o("tyNb"),c=o("IejH"),i=o("fXoL");let a=(()=>{class t{constructor(){}ngOnInit(){}}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=i.Fb({type:t,selectors:[["app-public-header"]],decls:4,vars:0,consts:[[1,"navbar","navbar-expand-lg","navbar-dark","bg-dark"],["href","#",1,"navbar-brand"]],template:function(t,e){1&t&&(i.Qb(0,"header"),i.Qb(1,"nav",0),i.Qb(2,"a",1),i.qc(3,"LOGO"),i.Pb(),i.Pb(),i.Pb())},styles:[""]}),t})(),s=(()=>{class t{constructor(){}ngOnInit(){}}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=i.Fb({type:t,selectors:[["app-public-footer"]],decls:4,vars:0,consts:[[1,"footer"],[1,"container","d-flex","justify-content-center","align-items-center",2,"height","100%"]],template:function(t,e){1&t&&(i.Qb(0,"footer",0),i.Qb(1,"div",1),i.Qb(2,"div"),i.qc(3,"Blah Blah Blah....."),i.Pb(),i.Pb(),i.Pb())},styles:[""]}),t})(),l=(()=>{class t{constructor(){}ngOnInit(){}}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=i.Fb({type:t,selectors:[["app-public-layout"]],decls:5,vars:0,consts:[[1,"wrapper"],[1,"main"]],template:function(t,e){1&t&&(i.Qb(0,"div",0),i.Mb(1,"app-public-header"),i.Qb(2,"div",1),i.Mb(3,"router-outlet"),i.Pb(),i.Mb(4,"app-public-footer"),i.Pb())},directives:[a,n.e,s],styles:[""]}),t})();var b=o("LRne"),u=o("qfco");let p=(()=>{class t{localStorageRemover(){localStorage.removeItem(u.a.FB_ACCESS_TOKEN),localStorage.removeItem(u.a.FB_AUTH_TOKEN),localStorage.removeItem(u.a.FB_ID_TOKEN),localStorage.removeItem(u.a.G_ACCESS_TOKEN),localStorage.removeItem(u.a.G_AUTH_TOKEN),localStorage.removeItem(u.a.G_ID_TOKEN)}}return t.\u0275fac=function(e){return new(e||t)},t.\u0275prov=i.Hb({token:t,factory:t.\u0275fac,providedIn:"root"}),t})();var d=o("ahC7");let f=(()=>{class t{constructor(t,e){this.genericUtils=t,this.authService=e,console.log("In public route resolver")}resolve(){return this.genericUtils.localStorageRemover(),this.authService.signOut(),Object(b.a)([])}}return t.\u0275fac=function(e){return new(e||t)(i.Ub(p),i.Ub(d.b))},t.\u0275prov=i.Hb({token:t,factory:t.\u0275fac,providedIn:"root"}),t})();var v=o("3Pt+"),h=o("diEX"),g=o("12jx"),m=o("TzPz"),I=o("Wp6s"),y=o("bTqV");const O=[{path:"",canActivate:[c.a],component:l,resolve:[f],children:[{path:"",component:(()=>{class t{constructor(t,e,o,r){this.formBuilder=t,this.authService=e,this.NotificationService=o,this.router=r,this.hide=!0}ngOnInit(){this.formGenerator()}formGenerator(){this.loginFormGroup=this.formBuilder.group({username:["",v.h.required],password:["",v.h.required]})}signInWithGoogle(){this.startBlocking(),this.authService.signIn(d.a.PROVIDER_ID).then(t=>{this.stopBlocking(),localStorage.setItem(u.a.G_ID_TOKEN,t.idToken),localStorage.setItem(u.a.G_AUTH_TOKEN,t.authToken),this.router.navigate([h.a.ROUTE_PROFILE])},t=>{console.log(t),this.NotificationService.openSnackBar(null==t?void 0:t.error,"dismiss"),this.stopBlocking()})}goToHome(){this.router.navigate([h.a.ROUTE_HOME])}startBlocking(){this.blockUI.start()}stopBlocking(){setTimeout(()=>{this.blockUI.stop()},2e3)}}return t.\u0275fac=function(e){return new(e||t)(i.Lb(v.a),i.Lb(d.b),i.Lb(m.a),i.Lb(n.b))},t.\u0275cmp=i.Fb({type:t,selectors:[["app-login"]],decls:15,vars:0,consts:[[1,"container-fluid"],[1,"row"],[1,"col-md-12"],[1,"d-flex","justify-content-center","align-items-end"],[1,"col-md-4",2,"margin-top","5%"],[1,"d-flex","justify-content-center"],[1,"row","d-flex","justify-content-center","m-2"],["mat-flat-button","","color","primary",1,"fullwidth",3,"click"]],template:function(t,e){1&t&&(i.Qb(0,"div",0),i.Qb(1,"div",1),i.Qb(2,"div",2),i.Qb(3,"div",3),i.Qb(4,"mat-card",4),i.Qb(5,"div",5),i.Qb(6,"h1"),i.qc(7,"Login"),i.Pb(),i.Pb(),i.Mb(8,"div",1),i.Qb(9,"div",6),i.Qb(10,"button",7),i.Xb("click",(function(){return e.signInWithGoogle()})),i.qc(11," Sign in with google"),i.Pb(),i.Pb(),i.Qb(12,"div",6),i.Qb(13,"button",7),i.Xb("click",(function(){return e.goToHome()})),i.qc(14,"Just Get in"),i.Pb(),i.Pb(),i.Pb(),i.Pb(),i.Pb(),i.Pb(),i.Pb())},directives:[I.a,y.a],styles:[""]}),function(t,e,o,r){var n,c=arguments.length,i=c<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(t,e,o,r);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(i=(c<3?n(i):c>3?n(e,o,i):n(e,o))||i);c>3&&i&&Object.defineProperty(e,o,i)}([Object(g.a)()],t.prototype,"blockUI",void 0),t})()}]}];let P=(()=>{class t{}return t.\u0275mod=i.Jb({type:t}),t.\u0275inj=i.Ib({factory:function(e){return new(e||t)},imports:[[n.d.forChild(O)],n.d]}),t})(),S=(()=>{class t{}return t.\u0275mod=i.Jb({type:t}),t.\u0275inj=i.Ib({factory:function(e){return new(e||t)},imports:[[P,r.a]]}),t})()}}]);