#include <bits/stdc++.h>

using namespace std;

class Board
{
public:
  Board(vector<int> b)
  {
    for (int i = 0; i < 5; ++i)
    {
      repr.push_back({});
      marks.push_back({});
      for (int j = 0; j < 5; ++j)
      {
        marks[i].push_back(false);
        repr[i].push_back(b[i * 5 + j]);
      }
    }
  }

  void mark_num(int n)
  {
    for (int i = 0; i < 5; ++i)
    {
      for (int j = 0; j < 5; ++j)
      {
        if (repr[i][j] == n)
          marks[i][j] = true;
      }
    }
  }

  bool checkRows()
  {
    for (auto r : marks)
    {
      bool found = true;
      for (int i = 0; i < 5; ++i)
      {
        if (!r[i])
        {
          found = false;
          break;
        }
      }
      if (found)
        return found;
    }
    return false;
  }

  bool checkCols()
  {
    for (int i = 0; i < 5; ++i)
    {
      vector<bool> col;
      bool found = true;
      for (int j = 0; j < 5; ++j)
      {
        col.push_back(marks[j][i]);
      }
      for (int k = 0; k < 5; ++k)
      {
        if (!col[k])
        {
          found = false;
          break;
        }
      }
      if (found)
        return found;
    }
    return false;
  }

  int score()
  {
    int sum = 0;
    for (int i = 0; i < 5; ++i)
    {
      for (int j = 0; j < 5; ++j)
      {
        if (!marks[i][j])
        {
          sum += repr[i][j];
        }
      }
    }
    return sum;
  }

  int checkWins(int last)
  {
    int score = -1;

    if (won)
      return score;

    bool found = checkCols();
    if (found)
    {
      won = true;
      return this->score() * last;
    }

    found = checkRows();
    if (found)
    {
      won = true;
      return this->score() * last;
    }

    return score;
  }

  bool won = false;
  vector<vector<bool>> marks;
  vector<vector<int>> repr;
};

void part1(string order, vector<Board> &boards)
{
  unsigned long long answer = 0;

  int start = 0, end = 0;
  while (true)
  {
    end = order.find(',', start);
    if (end == -1)
    {
      break;
    }
    int a = stoi(order.substr(start, end));
    for (Board &b : boards)
    {
      b.mark_num(a);
      int score = b.checkWins(a);
      if (score != -1)
      {
        answer = score;
        goto print1;
      }
    }
    start = end + 1;
  }

print1:
  cout << "PART 1: " << answer << endl;
}

void part2(string order, vector<Board> &boards)
{
  long long answer = 0;

  int start = 0, end = 0;
  while (true)
  {
    end = order.find(',', start);
    if (end == -1)
    {
      break;
    }
    int a = stoi(order.substr(start, end));
    for (Board &b : boards)
    {
      b.mark_num(a);
      int score = b.checkWins(a);
      if (score != -1)
      {
        answer = score;
      }
    }
    start = end + 1;
  }

  cout << "PART 2: " << answer << endl;
}

int main(int argc, char const *argv[])
{
  if (argc != 2)
  {
    cerr << "Invalid Usage. Usage: ./[binary] [input]" << endl;
    exit(EXIT_FAILURE);
  }

  string current;
  vector<string> lines;

  ifstream istr(argv[1]);

  string order;
  getline(istr, order);
  getline(istr, current);

  vector<Board> boards;
  vector<int> board;
  while (istr.peek() != EOF)
  {
    if (istr.peek() == '\n')
    {
      boards.push_back(Board(board));
      board.clear();
      istr.get();
    }
    else
    {
      for (int i = 0; i < 5; ++i)
      {
        istr >> current;
        board.push_back(stoi(current));
        istr.get();
      }
    }
  }

  boards.push_back(Board(board));
  board.clear();
  istr.get();

  part1(order, boards);
  part2(order, boards);

  return EXIT_SUCCESS;
}
