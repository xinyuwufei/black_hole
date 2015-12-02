//-------------------------Do Algorithms-------------------------
function Devide(a)
{
    if (cautiousWalk(a))
    {
        return;
    }
    
    var getlinks = getLinks(a);
    var linkForward = getlinks[0];
    var forward = linkStates[linkForward];
    // arrives at node v, start the next round
    if (forward != 2)
    {
        a.state = 1;
        a.stage++;
        a.direction = - a.direction;

        
        unexplored = (a.id === 2) ?  - nodeV.right + a.next - 1 : nodeV.left - a.next - 1;
        unexplored = unexplored < 0 ? unexplored + n :unexplored;

        getSegments((a.id === 2) ? nodeV.right: a.next);

        var left = (a.id === 2) ? nodeV.right + a.next : nodeV.left + a.next;
        //when nodeV is at homebase
        if (!a.next && a.id === 2)
        {
            left += n;    
        }

        left = Math.floor(left / 2) + 1;
        var right = left - 1;
        a.goal = left + 1 - a.id;
        
        E[a.id - 1][2 - a.id] = a.next; 
        whiteBoard(a.id, a.next, left, right);
        // check if the algorithm terminates
        if(E[a.id - 1][0] - 2 === E[a.id - 1][1] || E[a.id - 1][0] + n - 2 === E[a.id - 1][1])
        {
            a.report = true;
        }
    }

}


function OptTime(a) 
{
    if (a.goal === a.next)
    {
        a.direction = - a.direction;
        if (a.stage === 1)
        {
            // node i + 1 is -(n - i - 1) in the inverse direction      
            a.goal = (a.id + 1 ) % n;
            a.stage++;
        }else if (a.stage === 2)
        {
            a.report = true;
            a.goal = 0;
            if (a.next != blackHole)
            {
                console(a.id, 1);
            }
            if (!a.next)
            {
                console(a.id, 2);
                a.terminate = true;
                done++;
            }
        }
    }
}

function TradeOff(a)
{

    if (a.report && !a.next)
    {
        a.terminate = true;
        console(a.id, 2);
        done++;
        return;
    }
    
    // notify agents at the right side
    if (a.state === 4 && a.stage === 3)
    {
        notify(a, 0);
        a.direction = -a.direction;
        a.state = 3;
        a.stage++;
    // notify agents at the left side
    }else if(a.state === 4 && a.stage === 4)
    {
        notify(a, 1);
        a.goal  = S[a.id - 3][0];
        var goal = a.goal ? a.goal : n;
        a.state = 3;   
        a.stage = 1;
    } 
    
    if (a.goal === a.next && a.state === 3)
    {
        // have checked both sides,then move left notify other nodes
        if (a.stage === 2)
        {
            a.stage++;
            a.goal      = -1;
            var left    = S[a.id - 3][0];
            var right   = S[a.id - 3][1];
            if (a.next)
            {   
                right = a.next < right ? a.next : right;
            }
            // find the black hole
            if (left + 2 === right || left + 2 === n)
            {
                a.report = true;
                done = k - 1;
                a.goal = 0;
            }
            unexplored = right ? (right - left - 1) : (n - left - 1);
            getSegments(left);
        }
        // have checked the left side
        if (a.stage === 1 )
        {
            a.goal = S[a.id - 3][1];
            a.stage++;
            a.direction = - 1;
        }
        
    }
    if (a.id < 3)
    {
       cautiousWalk(a);
    }else{
       chase(a);
    }
}

            
function Pairing(a)
{
    if (chase(a))
    {
       cautiousWalk(a);
    }
}


function Elimination(a)
{


}



function Gathering(a)
{
    if (chase(a))
    {
       cautiousWalk(a);
    }
    
    if (a.state === 4)
    {
        if (gatherCount === k - 1)
        {
            console(a.next, 4);
            stop = true;
            gatherCount = 0;
        }
    }
}


function Bod(a)
{


}

function chase(a)
{
    // get link states
    var getlinks = getLinks(a);
    var linkForward = getlinks[0],
        linkBackward = getlinks[1];
    var forward = linkStates[linkForward],
        backward = linkStates[linkBackward];

    
    // find forward link becomes safe,then continue to chase
    if (a.state === 4 && forward === 2)
    {
        a.state = 3;
        if (algorithm === '6')
        {   
            gatherCount--;
        }
    }
    
    
    // find the node has been explored by other
    if (a.state === 1 && backward === 2 && forward)
    {
        a.state = 3;     
    }
    
    
    // stop chasing when the link is not safe 
    if (a.state === 3 && forward === 1)
    {
        if (algorithm === '3')
        {
            a.state = 4; 
        }
        // terminate and become paired-left or alone 
        else if (algorithm === '4')
        {
            a.terminate = true;
            done++;
        }
        else if (algorithm === '6')
        {   
            a.state = 4;
            gatherCount++;
        }
    }
    
    if (a.state > 2){
        return false;
    }
    return true;
    
}

function cautiousWalk(a)
{
    // get link states
    var getlinks = getLinks(a);
    var linkForward = getlinks[0],
        linkBackward = getlinks[1];
    var forward = linkStates[linkForward],
        backward = linkStates[linkBackward];
    
    
    // have not started / have not reach the goal 
    if (!a.state  || (a.next != a.goal && a.state === 1 && !forward && backward === 2))
    {
        a.state = 1;
        links[linkForward].width = 5;
        links[linkForward].strokeStyle = "#ffcc00";
        linkStates[linkForward] = 1;
        return true;
    }
    
    // make the explored link safe 
    if (backward === 1 && a.state > 1)
    {
        links[linkBackward].strokeStyle = "#00ff00";
        linkStates[linkBackward] = 2;
    }
    
    // check if the algorithm terminates
    if (algorithm === '1')
    {
        if (forward  && backward)
        { 
            // check if the algorithm terminates
            if (E[a.id - 1][0] - 2 === E[a.id - 1][1] || E[a.id - 1][0] + n - 2 === E[a.id - 1][1])
            {
                //a.state = 1;
                a.report = true;
            }
        }
        if (a.report && !a.next)
        {
            a.terminate = true;
            console(a.id, 2);
            done++;
        }
    }
    
    // when it is forwarding
    if (a.state === 1)
    {
        if (backward === 1)
        {
            a.state = 2;
        }
        
        if (algorithm === '1')
        {
            // complete my work this round
            if (a.next === a.goal)
            {
                a.state = 3;
                E[a.id - 1][a.id - 1] = a.next;
                // check if the algorithm terminates
                if(E[a.id - 1][0] - 2 === E[a.id - 1][1] || E[a.id - 1][0] + n - 2 === E[a.id - 1][1])
                {
                    a.report = true;
                }
                a.direction = - a.direction;
                return true;
            }
        }
        
        if (backward != 2)
        {
            a.direction = - a.direction;
        }
    }
    // return 
    else if (a.state === 2)
    {
        a.state = 1;
        a.direction = - a.direction;
        
        if (algorithm === '1')
        {
            // read message from the white board
            if (a.next === nodeV.pos && a.id === 3 - nodeV.id)
            {
                a.goal = (a.id === 1 ? nodeV.left : nodeV.right);
                console(a.id ,5)
                a.stage++;
            }
        }
    }else if (a.state === 3){
        return false;
    }
    return true;
}


function notify(a, t)
{
    for (var i = 2; i < k; i++) 
    {
        if (!t && i === a.id - 1)
        {
            continue;
        }
        if (agents[i].next === a.next && i - 2 < S.length)
        {
            var g = S[i - 2];
            if (g[0] != -1)
            {
                agents[i].goal = g[0];
                if (g[0] <= a.next && (g[1] >= a.next || g[1] === n ))
                {
                    agents[i].direction = -agents[i].direction;
                }else{
                    agents[i].direction = 1;
                }
                
            }
            agents[i].stage = 1;
            agents[i].state = 3;
        }
    }
    console(a, 6);
}


function cautiousWalkSimple(a,forward,backward){
   
    if(a.state===0 && linkStates[forward]===0 ){//如果 agent的状态是：准备探索 并 forwardport的状态是 danger
        links[forward].width = 5;
        links[forward].strokeStyle = "#ffcc00";//我们就把forwardport的颜色变成黄色
        linkStates[forward] = 1;//forwardport的状态变成 探索中
        a.state=1;
        lastVisited[a.id-1]=a.next;
        return;
        
    }
    
    if(a.state===1 && linkStates[backward]===1){//如果 agent的状态是：探索中 并 backwardport的状态是 探索中
        links[backward].width = 5;
        links[backward].strokeStyle = "#00ff00";//我们就把backwardport的颜色变成绿色
        linkStates[backward] = 2;//backwardport的状态变成 安全
        a.direction = -a.direction;
        a.state=-1;
        lastVisited[a.id-1]= a.next-1<0 ? n-1 : a.next-1;
        return;
        
    }
    // if(a.state===1 && linkStates[forward]===2){//如果 agent的状态是：探索中 并 forwardport的状态是 安全
    //     links[forward].width = 5;
    //     a.state=0;
    //     a.direction = -a.direction;
    //     return;
    // }
  if(a.state===-1){//如果 agent的状态是：临时返回 
        links[forward].width = 5;
        a.state=0;
        a.direction = -a.direction;
        lastVisited[a.id-1]= a.next+1==n ? 0 : a.next+1;
        return;
    }


}
function Divide1(a){
    var ports= getLinks(a);
    var forward = ports[0],
        backward = ports[1];
    // $('#conArea').append('id='+a.id+' a.state='+a.state+' a.next='+a.next+' forward='+forward+' backward='+backward+' fstate='+linkStates[forward]+' bstate='+linkStates[backward]+' direction='+a.direction+' goal='+a.goal+'\n');
    //返回到node V
    if(a.state===2&&(linkStates[forward]===1||linkStates[forward]===0)){
        // 当a返回到nodeV时,a.direction指向有黑洞的segment
        // 如果 a.direction==1   正方向 从最小到中间 S[0][0] - S[0][1]
        //                      反方向 从中间到最大 S[1][0] - S[1][1]
       

        var rangeWithBlackHole=a.direction>0 ? 0 : 1 ;
        var from=a.direction>0 ? 0 : 1;
        var currentRound=U.length-1;

        //  计算另一个没返回的agent在当前轮所走的距离（节点）
        // 如果nodeV的id(a.next)在有黑洞的segment里则更新index，跨过已走过的节点
        //     顺时针的更新起始节点+offset距离
        //     逆时针的更新终结节点-offset距离
        // 如果不在当前黑洞的segment里说明已经不走了被黑洞吃了,offset则为0

        var offset=U[currentRound].slice(S[rangeWithBlackHole][0],S[rangeWithBlackHole][1]+1).indexOf(a.next) > -1 ? Math.abs(a.next-U[currentRound][S[rangeWithBlackHole][from]])+1 : 0;
        
        //alert(U[currentRound][S[rangeWithBlackHole][from]]+' : '+S[rangeWithBlackHole]+' : '+from);
        //alert(a.next+' :rangeWithBlackHole='+U[currentRound].slice(S[rangeWithBlackHole][0],S[rangeWithBlackHole][1]+1)+' : '+offset);
        S[rangeWithBlackHole][from]+=offset*a.direction;
        //alert('newrange : '+U[currentRound].slice(S[rangeWithBlackHole][0],S[rangeWithBlackHole][1]+1));
        
        // push更新新的unexplored 集合U
        U.push(U[currentRound].slice(S[rangeWithBlackHole][0],S[rangeWithBlackHole][1]+1));
        currentRound+=1;
        console(a,3);
        // 如果|U|只剩下1
        if(U[currentRound].length===1){ 
            a.direction=-a.direction;
            a.state=3;  

        }
        //分段进入下一轮
        else{

            divideSegments(2,U[currentRound]);
            a.direction=-a.direction;
            a.goal = (a.direction>0) ? U[currentRound][S[0][1]] : U[currentRound][S[1][0]];
            //alert(a.direction+' : '+a.goal);
            
            a.state=0;
        }
    }
    if(a.next===0&&a.state===3){
        //终结状态
        console(a.id,2);
        
        done++;
        return;
        
    }
    if(a.next===a.goal && linkStates[backward]===1){//agents走到segment的最尾端，从a.goal返回到nodeV
        a.direction=-a.direction;
        a.state=2;
        links[backward].strokeStyle = "#00ff00";//我们就把backwardport的颜色变成绿色
        linkStates[backward] = 2;//backwardport的状态变成 安全
        //$('#conArea').append('id='+a.id+' a.state='+a.state+' a.next='+a.next+' forward='+forward+' backward='+backward+' fstate='+linkStates[forward]+' bstate='+linkStates[backward]+' direction='+a.direction+' goal='+a.goal+'\n');
    }
   
    cautiousWalkSimple(a,forward,backward);

}

function Pairing1(a){
    var ports= getLinks(a);
    var forward = ports[0],
        backward = ports[1];
    var nodeVisited=0;

//step1:
    //1. If an agent reaches a node visited by another agent b, it becomes chasing, and follows
    //b’s trace.
    //a.state==0 说明agent a 安全的到达了当前节点（a.next）
    for(var i=0;i<bases.length&&a.state==0;i++){
        if(i+1!=a.id){
            //如果是最开始initialize则不判断，防止id小的node的a.next已经变了之后再比较
            if(a.next==bases[a.id-1])break;//if(a.next==bases[a.id-1]&&a.state==0)break;
            //如果 chased （被追的agent）在探索‘临时返回’时碰见了chasing agent，则不能让被准的反过来去追现在追的
            if(agents[i].chasing>=0&&a.next==agents[agents[i].chasing].next)break;

            if(a.next>=bases[i]&&a.next<=agents[i].next){
            //alert(a.id+' : a.next: '+a.next+' base: '+bases[i]+' agents[i].id: '+agents[i].id+' agents[i].next: '+agents[i].next);
                nodeVisited++;
                chasedAgent=i;
                //alert(nodeVisited);

            }
        }
    }
    //agents[chasedAgent].id!==a.id

    if(nodeVisited===1){
        //step1 continued
        a.chasing=chasedAgent;

        alert(a.id+' :chaising '+agents[chasedAgent].id +' lastsafenode: '+lastSafeNode(a.chasing)+' a.chasing.direction: '+agents[a.chasing].direction+' agents[a.chasing].state: '+agents[a.chasing].state);
        if(a.next==lastSafeNode(a.chasing)){
        //step3
            a.joinme=true;
            a.terminate=true;
            //done++;
            a.state=-5;
            alert(a.id+' :paired-left with '+agents[a.chasing].id+' a.next:'+a.next);

        }
    }


    //step2   
    if(nodeVisited>1){
            a.terminate=true;
            //done++;
            a.state=4;//alone
            alert(a.id+' :alone');
    }

    //step1,a.chasing==-1 是初始化值，代表不chasing
    if(a.chasing==-1){
     
        for(var i=0;i<agents.length;i++){
            if(agents[i].id!=a.id){
                if(agents[i].next==a.next&&agents[i].joinme){
                    alert(a.id+'paired-right: '+a.next+' paired-left: '+agents[i].next);
                    a.state=5;//paired-right
                    agents[i].joinme=false;
                    
                    a.terminate=true;
                    //done++;
                    break;

                }
            }

        }
      
    }
    


    cautiousWalkSimple(a,forward,backward);
}


function lastSafeNode(id){
  return lastVisited[id];    
}
// function getDirection(id){
//     var half=Math.floor(n/2);
//     if(id==0)return false;
//     return id<=half ? true : false

// }

// function lastSafeNode(a){
  
//     if(a.state==-1)return a.next+1==n ? 0 : a.next+1;
//     if(a.state==0)return a.next;
//     if(a.state==1)return a.next-1<0 ? n-1 : a.next-1;
  
   
   
    
// }
  
//     if(a.state==0)return a.next+1==n ? 0 : a.next+1;
//     if(a.state==1)return a.next;
//     if(a.state==-1)return a.next-1<0 ? n-1 : a.next-1;
  
   
   
    
// }




