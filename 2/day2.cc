#include <bits/stdc++.h>

using namespace std;

void part1(vector<string> &lines)
{
  unsigned long long answer = 0;
  int hor = 0, depth = 0;

  for (auto s : lines)
  {
    if (s[0] == 'f')
    {
      hor += stoi(s.substr(s.find(' ')));
    }
    else if (s[0] == 'd')
    {
      depth += stoi(s.substr(s.find(' ')));
    }
    else
    {
      depth -= stoi(s.substr(s.find(' ')));
    }
  }

  answer = depth * hor;
  cout << "PART 1: " << answer << endl;
}

void part2(vector<string> &lines)
{
  unsigned long long answer = 0;
  int hor = 0, depth = 0, aim = 0;

  for (auto s : lines)
  {
    if (s[0] == 'f')
    {
      int x = stoi(s.substr(s.find(' ')));
      depth += x * aim;
      hor += x;
    }
    else if (s[0] == 'd')
    {
      aim += stoi(s.substr(s.find(' ')));
    }
    else
    {
      aim -= stoi(s.substr(s.find(' ')));
    }
  }

  answer = depth * hor;

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
    lines.push_back(current);
  }

  part1(lines);
  part2(lines);

  return EXIT_SUCCESS;
}
