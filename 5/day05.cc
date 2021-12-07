#include <bits/stdc++.h>

using namespace std;

class Graph
{
public:
  Graph(bool diags)
  {
    this->diags = diags;
    for (int i = 0; i < 1000; ++i)
    {
      repr.push_back(vector<int>(1000, 0));
    }
  }

  void AddLine(pair<int, int> &a, pair<int, int> &b)
  {
    if (a.first == b.first)
    {
      int begin = min(a.second, b.second);
      int end = max(a.second, b.second);
      for (int i = begin; i <= end; ++i)
      {
        ++repr[a.first][i];
      }
    }
    else if (a.second == b.second)
    {
      int begin = min(a.first, b.first);
      int end = max(a.first, b.first);
      for (int i = begin; i <= end; ++i)
      {
        ++repr[i][a.second];
      }
    }
    else if (this->diags && abs(a.first - b.first) == abs(a.second - b.second))
    {
      pair<int, int> *begin;
      pair<int, int> *end;
      if (a.first < b.first)
      {
        begin = &a;
        end = &b;
      }
      else
      {
        begin = &b;
        end = &a;
      }

      bool up;
      if (begin->second < end->second)
      {
        up = true;
      }
      else
      {
        up = false;
      }

      for (int i = begin->first; i <= end->first; ++i)
      {
        if (up)
        {
          ++repr[i][begin->second + (i - begin->first)];
        }
        else
        {
          ++repr[i][begin->second - (i - begin->first)];
        }
      }
    }
  }

  long long CountOverlap()
  {
    long long count = 0;
    for (auto a : repr)
    {
      for (auto b : a)
      {
        if (b > 1)
        {
          ++count;
        }
      }
    }
    return count;
  }

  bool diags;
  vector<vector<int>> repr;
};

void part1(vector<string> &lines)
{
  unsigned long long answer = 0;
  int begin = 0;
  int end = 0;

  Graph g(false);

  for (auto line : lines)
  {
    pair<int, int> first, second;
    end = line.find(',');
    first.first = stoi(line.substr(begin, end - begin));
    begin = end + 1;
    end = line.find(' ', begin);
    first.second = stoi(line.substr(begin, end - begin));
    end += 4;
    begin = end;
    end = line.find(',', begin);
    second.first = stoi(line.substr(begin, end - begin));
    begin = end + 1;
    second.second = stoi(line.substr(begin));

    g.AddLine(first, second);
    begin = 0;
  }

  answer = g.CountOverlap();

  cout << "PART 1: " << answer << endl;
}

void part2(vector<string> &lines)
{
  unsigned long long answer = 0;
  int begin = 0;
  int end = 0;

  Graph g(true);

  for (auto line : lines)
  {
    pair<int, int> first, second;
    end = line.find(',');
    first.first = stoi(line.substr(begin, end - begin));
    begin = end + 1;
    end = line.find(' ', begin);
    first.second = stoi(line.substr(begin, end - begin));
    end += 4;
    begin = end;
    end = line.find(',', begin);
    second.first = stoi(line.substr(begin, end - begin));
    begin = end + 1;
    second.second = stoi(line.substr(begin));

    g.AddLine(first, second);
    begin = 0;
  }

  answer = g.CountOverlap();

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

  while (getline(istr, current))
  {
    if (current == "\n")
      break;
    lines.push_back(current);
  }

  part1(lines);
  part2(lines);

  return EXIT_SUCCESS;
}
