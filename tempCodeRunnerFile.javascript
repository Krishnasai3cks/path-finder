called = 0;
grid=[];
for(let i =0;i<50;i++){
    let string;
    if(i%2==0){
        string = ('.'.repeat(50));
    } else {
        if(called%2==0){
            string = ('#'.repeat(49)+'.')
        } else {
            string = ("."+"#".repeat(49));
        }
        called++;
    }
    grid.push(string.split(''))
}
console.log(grid);