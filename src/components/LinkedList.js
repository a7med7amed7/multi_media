class node{
    constructor(data){
        this.data=data
        this.next=null
        this.pre=null
    }
}

class linkedList{
    constructor(){
        this.head=null
        this.current=null
    }
    insert(data){
        let newNode =new node(data)
        if (this.head ===null){
            this.head=newNode
            this.current=newNode
        }
        else{
            let temp =this.head;
            while(temp.next !== null){
                temp=temp.next
            }
            temp.next=newNode
            newNode.pre=temp
            this.current =newNode
        }
        
    }
    redo=()=>{
        const nextData=this.current.next
        if (nextData){
            this.current=nextData
            return nextData.data
        }
        else{
            return null
        }
    }
    undo = ()=>{
        const preData=this.current.pre
        if (preData){
            this.current=preData
            return preData.data
        }
        else{
            return null
        }
    }
    rest=()=>{
        
    }
}
 const store =new linkedList()
export default store;