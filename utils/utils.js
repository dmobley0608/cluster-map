exports.getCallTypeCounts = (cases) => {
    const callTypeCounts = {}
    for (_case of cases) {       
       if(!callTypeCounts[_case.properties.problem]){
        
        callTypeCounts[_case.properties.problem] = 1
       }else{
        callTypeCounts[_case.properties.problem] ++;
       }      
    }
    

    return callTypeCounts;
}

exports.getOfficerCounts = (cases) => {
    const officers = {
    }
    for (_case of cases) {
        if (!officers[_case.properties.officer]) {
            officers[_case.properties.officer] = 1
        }else{
            officers[_case.properties.officer] += 1
        }
    }

    return officers;
}

exports.getRepeatCases=(cases)=>{
    const repeatCases = {}
    let newCases = cases
    for(_case of newCases){
        let test = cases.filter(c => c.properties.address === _case.properties.address);              
        if(test.length > 2 ){
            repeatCases[_case.name] = {..._case, count:test.length}          
        }
       
    }
    return repeatCases;
}