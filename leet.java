import java.util.Arrays;
class leet {

    public static void main(String[] args) {
        int m=4;
        int n=6;
        int guards[][]={{0,0},{1,1},{2,3}};
        int walls[][]={{0,1},{2,2},{1,4}};

        System.out.println(new leet().countUnguarded(m,n,guards,walls));

    }

    public int countUnguarded(int m, int n, int[][] guards, int[][] walls) {
   
      boolean grid[][]=new boolean[m][n];

      boolean[][] ans=new boolean[m][n];

      for(boolean arr[]:grid){
        Arrays.fill(arr, true);
    }


      assignWallsAndGuard(grid,guards,walls);
      assignWallsAndGuard(ans,guards,walls);


      for(int i=0;i<m;i++){
        for(int j=0;j<n;j++){
            if(!grid[i][j]){
            setFalseUp(ans, i-1, j);
            System.out.println();
            setFalseDown(ans, i+1, j);
            System.out.println();
            setFalseLeft(ans, i, j-1);
            System.out.println();
            setFalseRight(ans, i, j+1);
            System.out.println();
            }
        }
      }

    int count=0;

    for(int i=0;i<m;i++)
    for(int j=0;j<n;j++)
        if(ans[i][j]) count++;

return count;
    }


    void assignWallsAndGuard(boolean[][] grid,int[][] guards,int[][] walls){
      
      for(int i=0;i<guards.length;i++){
        grid[guards[i][0]][guards[i][1]]=false;
      }

      for(int i=0;i<walls.length;i++){
        grid[walls[i][0]][walls[i][1]]=false;
      }
    }
      

    void setFalseUp(boolean grid[][],int m,int n){
      
        while(m>=0  && grid[m][n])
          grid[m--][n]=false;

          
          for(boolean arr[]:grid)
          System.out.println(Arrays.toString(arr));
    }
    
    void setFalseDown(boolean grid[][],int m,int n){   
        while(m<grid.length  && grid[m][n])
          grid[m++][n]=false;
    
          for(boolean arr[]:grid)
          System.out.println(Arrays.toString(arr));

        }
    
    void setFalseLeft(boolean grid[][],int m,int n){    
        while(n>=0  && grid[m][n])
          grid[m][n--]=false;
    
          
          for(boolean arr[]:grid)
          System.out.println(Arrays.toString(arr));

        }
    
    void setFalseRight(boolean grid[][],int m,int n){    
        while(n<grid[0].length  && grid[m][n])
          grid[m][n--]=false;

          for(boolean arr[]:grid)
          System.out.println(Arrays.toString(arr));

    }
    
}